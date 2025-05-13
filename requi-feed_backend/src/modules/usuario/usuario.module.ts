import { Module } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { UsuarioController } from './usuario.controller';
import { PrismaService } from 'src/db/prisma.service';

@Module({
  controllers: [UsuarioController],
  providers: [UsuarioService, {provide: PrismaService,
    useFactory: () => PrismaService.getInstance()
  }],
})
export class UsuarioModule {}
