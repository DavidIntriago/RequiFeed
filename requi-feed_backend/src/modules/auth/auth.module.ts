import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { MailService } from '../mail/mail.service';
import { AuthController } from './auth.controller';
import { CuentaService } from '../cuenta/cuenta.service';
import { PrismaService } from 'src/db/prisma.service';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'TuSecretoMuySeguro',
      signOptions: { expiresIn: '1h' }, // token válido 1 hora
    }),
  ],
  providers: [AuthService, MailService, CuentaService, {provide: PrismaService,
        useFactory: () => PrismaService.getInstance()
      }],
  controllers: [AuthController],
})
export class AuthModule {}
