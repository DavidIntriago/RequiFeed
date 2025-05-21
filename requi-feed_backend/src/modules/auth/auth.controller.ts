import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MailService } from '../mail/mail.service';
import { CuentaService } from '../cuenta/cuenta.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private mailService: MailService,
    private usersService: CuentaService,
  ) {}

  @Post('recover-password')
  async recoverPassword(@Body('email') email: string) {
    const token = await this.authService.generatePasswordResetToken(email);
    console.log(token);
    if (token) {
      await this.mailService.sendRecoveryEmail(email, token);
    } else {
      return { 
        status: 400,
        message: 'No se encontro el correo, por favor ingrese un correo registrado en el sistema' };
    }
    return { 
      status: 200,
      message: 'Correo Enviado' };
  }

  @Post('reset-password')
  async resetPassword(
    @Body() body: { token: string; newPassword: string },
  ) {
    const payload = await this.authService.verifyPasswordResetToken(body.token);
    console.log("paylad", payload);
    if (!payload) {
      return { message: 'Token inválido o expirado.' };
    }

    await this.usersService.updateContrasenia(payload.email, body.newPassword);
    return { message: 'Contraseña actualizada correctamente.' };
  }
}
