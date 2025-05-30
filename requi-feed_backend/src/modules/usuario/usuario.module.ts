import { Module } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { UsuarioController } from './usuario.controller';
import { PrismaService } from 'src/db/prisma.service';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    MulterModule.register({
      dest: './uploads',
    }),
    // ServeStaticModule.forRoot({
    //   rootPath: join(__dirname, '..', 'client'),
    // }),
  ],
  controllers: [UsuarioController],
  providers: [UsuarioService, {provide: PrismaService,
    useFactory: () => PrismaService.getInstance()
  }],
})
export class UsuarioModule {}
