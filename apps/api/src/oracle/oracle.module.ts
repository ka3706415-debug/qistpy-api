import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { OracleAdminController } from './oracle-admin.controller';
import { OracleService } from './oracle.service';
import { OracleSyncJob } from './oracle-sync.job';

@Module({
  imports: [PrismaModule],
  controllers: [OracleAdminController],
  providers: [OracleService, OracleSyncJob],
  exports: [OracleService],
})
export class OracleModule {}