import { Module, forwardRef } from '@nestjs/common';
import { ComentarioService } from './comentario.service';
import { ComentarioController } from './comentario.controller';
import { PrismaService } from 'src/db/prisma.service';

@Module({
  controllers: [ComentarioController],
  providers: [ComentarioService, {provide: PrismaService,
    useFactory: () => PrismaService.getInstance()
    }],
    exports: [PrismaService],
})
export class ComentarioModule {}
