import { Module } from '@nestjs/common';
import { ProyectoService } from './proyecto.service';
import { ProyectoController } from './proyecto.controller';
import { PrismaService } from 'src/db/prisma.service';

@Module({
  controllers: [ProyectoController],
  providers: [ProyectoService, {provide: PrismaService,
    useFactory: () => PrismaService.getInstance()
  }],
  exports: [PrismaService],
})
export class ProyectoModule {}
