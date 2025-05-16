import { Module } from '@nestjs/common';
import { GrupoService } from './grupo.service';
import { GrupoController } from './grupo.controller';

@Module({
  controllers: [GrupoController],
  providers: [GrupoService],
})
export class GrupoModule {}
