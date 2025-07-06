import { Module } from '@nestjs/common';
import { CalificacionController } from './calificacion.controller';
import { CalificacionService } from './calificacion.service';
import { PrismaService } from 'src/db/prisma.service';

@Module({
  controllers: [CalificacionController],
  providers: [CalificacionService, {provide: PrismaService,
      useFactory: () => PrismaService.getInstance()
      }],
      exports: [PrismaService],
})
export class CalificacionModule {}
