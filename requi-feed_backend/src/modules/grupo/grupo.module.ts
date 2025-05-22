import { Module } from '@nestjs/common';
import { GrupoService } from './grupo.service';
import { GrupoController } from './grupo.controller';
import { PrismaService } from 'src/db/prisma.service';

@Module({
  controllers: [GrupoController],
  providers: [GrupoService, {provide: PrismaService,
        useFactory: () => PrismaService.getInstance()
      }],
})
export class GrupoModule {}
