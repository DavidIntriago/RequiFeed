import { Module } from '@nestjs/common';
import { ProyectoService } from './proyecto.service';
import { ProyectoController } from './proyecto.controller';

@Module({
  controllers: [ProyectoController],
  providers: [ProyectoService],
})
export class ProyectoModule {}
