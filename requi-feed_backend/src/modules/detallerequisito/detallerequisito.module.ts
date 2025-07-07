import { Module } from '@nestjs/common';
import { DetallerequisitoService } from './detallerequisito.service';
import { DetallerequisitoController } from './detallerequisito.controller';
import { PrismaService } from 'src/db/prisma.service';

@Module({
  controllers: [DetallerequisitoController],
  providers: [DetallerequisitoService, {provide: PrismaService,
      useFactory: () => PrismaService.getInstance()
    }],
})
export class DetallerequisitoModule {}
