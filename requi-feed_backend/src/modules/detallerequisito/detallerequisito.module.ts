import { Module } from '@nestjs/common';
import { DetallerequisitoService } from './detallerequisito.service';
import { DetallerequisitoController } from './detallerequisito.controller';

@Module({
  controllers: [DetallerequisitoController],
  providers: [DetallerequisitoService],
})
export class DetallerequisitoModule {}
