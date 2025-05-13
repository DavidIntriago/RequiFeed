import { Module } from '@nestjs/common';
import { CuentaService } from './cuenta.service';
import { CuentaController } from './cuenta.controller';
import { PrismaService } from 'src/db/prisma.service';

@Module({
  controllers: [CuentaController],
  providers: [CuentaService, {provide: PrismaService,
      useFactory: () => PrismaService.getInstance()
    }],
})
export class CuentaModule {}
