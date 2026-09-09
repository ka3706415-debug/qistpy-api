import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { OracleService } from './oracle.service';

@Injectable()
export class OracleSyncJob {
  private readonly logger = new Logger(OracleSyncJob.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly oracle: OracleService,
  ) {}

  @Cron('0 */2 * * *', { timeZone: 'Asia/Karachi', name: 'oracle-price-sync' })
  async syncPrices(): Promise<void> {
    this.logger.log('Oracle price sync started...');
    const linked = await this.prisma.product.findMany({
      where: { oracleItemId: { not: null } },
      select: { id: true, oracleItemId: true, cashPrice: true },
    });

    let updated = 0;
    for (const product of linked) {
      try {
        const item = await this.oracle.getItemById(product.oracleItemId!);
        if (!item) continue; // Oracle se item hi gayab ho gaya — skip, delete nahi karenge

        const priceChanged = Number(product.cashPrice) !== item.cashPrice;

        await this.prisma.$transaction(async (tx) => {
          await tx.product.update({
            where: { id: product.id },
            data: { cashPrice: item.cashPrice, lastOracleSyncAt: new Date() },
          });

          for (const plan of item.plans) {
            await tx.installmentPlan.upsert({
              where: {
                productId_durationMonths: { productId: product.id, durationMonths: plan.durationMonths },
              },
              update: {
                advanceAmount: plan.advanceAmount,
                monthlyAmount: plan.monthlyAmount,
                markupPercentage: plan.markupPercentage,
                markupAmount: plan.totalPayable - item.cashPrice,
                totalPayable: plan.totalPayable,
              },
              create: {
                productId: product.id,
                durationMonths: plan.durationMonths,
                advanceAmount: plan.advanceAmount,
                monthlyAmount: plan.monthlyAmount,
                markupPercentage: plan.markupPercentage,
                markupAmount: plan.totalPayable - item.cashPrice,
                totalPayable: plan.totalPayable,
              },
            });
          }
        });

        if (priceChanged) updated++;
      } catch (err) {
        this.logger.error(`Failed to sync product ${product.id}`, err);
      }
    }
    this.logger.log(`Oracle sync done — ${updated}/${linked.length} products price-changed`);
  }
}