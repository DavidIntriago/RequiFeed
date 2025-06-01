import { Module } from '@nestjs/common';
import { RequisitoService } from './requisito.service';
import { RequisitoController } from './requisito.controller';
import { PrismaService } from 'src/db/prisma.service';

@Module({
  controllers: [RequisitoController],
  providers: [RequisitoService, {provide: PrismaService,
    useFactory: () => PrismaService.getInstance()
  }],
})
export class RequisitoModule {}
