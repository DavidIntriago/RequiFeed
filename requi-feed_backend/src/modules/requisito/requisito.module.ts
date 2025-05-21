import { Module } from '@nestjs/common';
import { RequisitoService } from './requisito.service';
import { RequisitoController } from './requisito.controller';

@Module({
  controllers: [RequisitoController],
  providers: [RequisitoService],
})
export class RequisitoModule {}
