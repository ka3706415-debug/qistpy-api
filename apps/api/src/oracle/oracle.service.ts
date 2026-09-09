import { BadRequestException, Injectable, Logger, NotFoundException, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ProductStatus } from '@prisma/client';
import oracledb from 'oracledb';
try {
  oracledb.initOracleClient({ libDir: 'C:\\oracle\\instantclient_19_23' });
} catch (err) {
  console.error('Oracle Thick mode client load nahi ho saka:', err);
}
import { slugify } from '../common/slugify';
import { PrismaService } from '../prisma/prisma.service';

oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

export interface OracleItem {
  itemId: string;
  itemTitle: string;
  cashPrice: number;
  plans: {
    durationMonths: number;
    markupPercentage: number;
    advanceAmount: number;
    monthlyAmount: number;
    totalPayable: number;
  }[];
}

@Injectable()
export class OracleService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(OracleService.name);
  private pool: oracledb.Pool | null = null;

  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit(): Promise<void> {
    try {
      this.pool = await oracledb.createPool({
        user: process.env.ORACLE_USER,
        password: process.env.ORACLE_PASSWORD,
        connectString: `${process.env.ORACLE_HOST}:${process.env.ORACLE_PORT}/${process.env.ORACLE_SID}`,
        poolMin: 1,
        poolMax: 5,
        poolIncrement: 1,
      });
      this.logger.log('✅ Oracle pool connected');
    } catch (err) {
      this.logger.error('❌ Oracle pool failed to connect', err);
    }
  }

  async onModuleDestroy(): Promise<void> {
    if (this.pool) await this.pool.close(5);
  }

  async getAllItems(search?: string): Promise<OracleItem[]> {
    if (!this.pool) throw new Error('Oracle not connected');
    const conn = await this.pool.getConnection();
    try {
      const where = search ? `WHERE UPPER(ITEM_TITLE) LIKE UPPER(:search)` : '';
      const binds = search ? { search: `%${search}%` } : {};
      const result = await conn.execute(`SELECT * FROM item_list_qistpy ${where}`, binds);
      return (result.rows as any[]).map((r) => this.mapRow(r));
    } finally {
      await conn.close();
    }
  }

  async getItemById(itemId: string): Promise<OracleItem | null> {
    if (!this.pool) throw new Error('Oracle not connected');
    const conn = await this.pool.getConnection();
    try {
      const result = await conn.execute(`SELECT * FROM item_list_qistpy WHERE ITEM_ID = :itemId`, { itemId });
      const rows = result.rows as any[];
      return rows.length ? this.mapRow(rows[0]) : null;
    } finally {
      await conn.close();
    }
  }

  async importAsProduct(itemId: string, dto: {
    categoryId: string;
    brandId?: string;
    description: string;
    shortDescription?: string;
    stock: number;
    images: { publicId: string; url: string; alt?: string; isPrimary?: boolean }[];
  }) {
    const item = await this.getItemById(itemId);
    if (!item) throw new NotFoundException('Oracle item not found');
    if (item.plans.length === 0) {
      throw new BadRequestException('This Oracle item has no installment plans configured');
    }

    const existing = await this.prisma.product.findUnique({ where: { oracleItemId: item.itemId } });
    if (existing) {
      throw new BadRequestException(`Yeh item pehle se import ho chuka hai (product: ${existing.name})`);
    }

    const category = await this.prisma.category.findUnique({ where: { id: dto.categoryId } });
    if (!category || !category.isActive) throw new BadRequestException('Selected category is not available');

    if (dto.brandId) {
      const brand = await this.prisma.brand.findUnique({ where: { id: dto.brandId } });
      if (!brand || !brand.isActive) throw new BadRequestException('Selected brand is not available');
    }

    const vendor = await this.prisma.vendor.findFirst({
      where: { status: 'APPROVED' },
      orderBy: { createdAt: 'asc' },
    });
    if (!vendor) throw new BadRequestException('No approved vendor found — seed the database first');

    const images = (dto.images ?? []).map((img, idx) => ({
      ...img,
      orderIndex: idx,
      isPrimary: img.isPrimary ?? idx === 0,
    }));
    if (images.filter((i) => i.isPrimary).length > 1) {
      throw new BadRequestException('Only one image can be marked primary');
    }

    const slug = await this.uniqueSlug(item.itemTitle);
    const lowestAdvance = Math.min(...item.plans.map((p) => p.advanceAmount));
    const lowestMonthly = Math.min(...item.plans.map((p) => p.monthlyAmount));

    return this.prisma.product.create({
      data: {
        vendorId: vendor.id,
        categoryId: dto.categoryId,
        brandId: dto.brandId,
        name: item.itemTitle,
        slug,
        description: dto.description,
        shortDescription: dto.shortDescription,
        cashPrice: item.cashPrice,
        stock: dto.stock,
        status: ProductStatus.PUBLISHED,
        oracleItemId: item.itemId,
        lastOracleSyncAt: new Date(),
        lowestAdvance,
        lowestMonthly,
        images: { create: images },
        plans: {
          create: item.plans.map((p) => ({
            durationMonths: p.durationMonths,
            advanceAmount: p.advanceAmount,
            monthlyAmount: p.monthlyAmount,
            markupPercentage: p.markupPercentage,
            markupAmount: p.totalPayable - item.cashPrice,
            totalPayable: p.totalPayable,
            isActive: true,
          })),
        },
      },
      include: { images: true, plans: true },
    });
  }

  private async uniqueSlug(name: string): Promise<string> {
    const base = slugify(name);
    let slug = base;
    let counter = 1;
    while (true) {
      const existing = await this.prisma.product.findUnique({ where: { slug } });
      if (!existing) return slug;
      slug = `${base}-${counter++}`;
    }
  }

      private mapRow(row: any): OracleItem {
    const planMap = new Map<number, {
      durationMonths: number;
      markupPercentage: number;
      advanceAmount: number;
      monthlyAmount: number;
      totalPayable: number;
    }>();

    for (let i = 1; i <= 8; i++) {
      const month = row[`PKG_MON${i}`];
      if (month === null || month === undefined) continue;
      const durationMonths = Number(month);
      if (durationMonths <= 0) continue; // khaali/invalid slot

      const candidate = {
        durationMonths,
        markupPercentage: Number(row[`PKG_PER${i}`]),
        advanceAmount: Number(row[`ADV${i}`]),
        monthlyAmount: Number(row[`QIST${i}`]),
        totalPayable: Number(row[`PKG_RATE${i}`]),
      };

      const existing = planMap.get(durationMonths);
      // Oracle mein same duration ka duplicate row mil sakta hai (data quality issue).
      // Jiska advance 0/adhoora hai use ignore karo, valid (non-zero advance) wali rakho.
      if (!existing || (existing.advanceAmount === 0 && candidate.advanceAmount > 0)) {
        planMap.set(durationMonths, candidate);
      }
    }

    return {
      itemId: String(row.ITEM_ID),
      itemTitle: row.ITEM_TITLE,
      cashPrice: Number(row.RSRATE),
      plans: Array.from(planMap.values()),
    };
  }
}