import { Body, Controller, Get, HttpCode, HttpStatus, NotFoundException, Param, Post, Query, UseGuards } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { ImportOracleProductDto } from './dto/import-oracle-product.dto';
import { OracleService } from './oracle.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.PRODUCT_MANAGER)
@Controller('admin/oracle-items')
export class OracleAdminController {
  constructor(private readonly oracle: OracleService) {}

  // GET /api/admin/oracle-items?search=xyz
  // Admin panel "Add Product" search box ke liye — lightweight list.
  @Get()
  async search(@Query('search') search?: string) {
    const items = await this.oracle.getAllItems(search);
    return items.map((i) => ({
      itemId: i.itemId,
      itemTitle: i.itemTitle,
      cashPrice: i.cashPrice,
      planCount: i.plans.length,
    }));
  }

  // GET /api/admin/oracle-items/:itemId
  // Admin ne ek item select kiya — poora record (cashPrice + saare plans) chahiye form fill karne ke liye.
  @Get(':itemId')
  async getOne(@Param('itemId') itemId: string) {
    const item = await this.oracle.getItemById(itemId);
    if (!item) throw new NotFoundException('Oracle item not found');
    return item;
  }

  // POST /api/admin/oracle-items/:itemId/import
  // Admin ne category + image de di — product turant bana ke publish kar do.
  @Post(':itemId/import')
  @HttpCode(HttpStatus.CREATED)
  import(@Param('itemId') itemId: string, @Body() dto: ImportOracleProductDto) {
    return this.oracle.importAsProduct(itemId, dto);
  }
}