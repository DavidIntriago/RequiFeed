import { Module } from '@nestjs/common';
import { PeriodoacademicoService } from './periodoacademico.service';
import { PeriodoacademicoController } from './periodoacademico.controller';
import { PrismaService } from 'src/db/prisma.service';

@Module({
  controllers: [PeriodoacademicoController],
  providers: [PeriodoacademicoService, {provide: PrismaService,
          useFactory: () => PrismaService.getInstance()
        }],
})
export class PeriodoacademicoModule {}
