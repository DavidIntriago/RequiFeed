import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MailService } from '../mail/mail.service';
import { CuentaService } from '../cuenta/cuenta.service';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;
  let mailService: MailService;
  let cuentaService: CuentaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            generatePasswordResetToken: jest.fn(),
            verifyPasswordResetToken: jest.fn(),
          },
        },
        {
          provide: MailService,
          useValue: {
            sendRecoveryEmail: jest.fn(),
          },
        },
        {
          provide: CuentaService,
          useValue: {
            updateContrasenia: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
    mailService = module.get<MailService>(MailService);
    cuentaService = module.get<CuentaService>(CuentaService);
  });

  describe('recoverPassword', () => {
    it('debería enviar un correo si el token es válido', async () => {
      jest.spyOn(authService, 'generatePasswordResetToken').mockResolvedValue('token123');
      const sendEmailSpy = jest.spyOn(mailService, 'sendRecoveryEmail').mockResolvedValue(undefined);

      const result = await controller.recoverPassword('correo@ejemplo.com');

      expect(result).toEqual({ status: 200, message: 'Correo Enviado' });
      expect(sendEmailSpy).toHaveBeenCalledWith('correo@ejemplo.com', 'token123');
    });

    it('debería retornar error si no se genera token', async () => {
      jest.spyOn(authService, 'generatePasswordResetToken').mockResolvedValue(null);

      const result = await controller.recoverPassword('noexiste@correo.com');

      expect(result).toEqual({
        status: 400,
        message: 'No se encontro el correo, por favor ingrese un correo registrado en el sistema',
      });
    });
  });

  describe('resetPassword', () => {
    it('debería actualizar la contraseña si el token es válido', async () => {
      jest.spyOn(authService, 'verifyPasswordResetToken').mockResolvedValue({
        email: 'correo@ejemplo.com',
      });

      const updateSpy = jest.spyOn(cuentaService, 'updateContrasenia').mockResolvedValue(undefined);

      const result = await controller.resetPassword({
        token: 'token123',
        newPassword: 'nuevaClaveSegura123',
      });

      expect(updateSpy).toHaveBeenCalledWith('correo@ejemplo.com', 'nuevaClaveSegura123');
      expect(result).toEqual({ message: 'Contraseña actualizada correctamente.' });
    });

    it('debería retornar error si el token es inválido', async () => {
      jest.spyOn(authService, 'verifyPasswordResetToken').mockResolvedValue(null);

      const result = await controller.resetPassword({
        token: 'tokenInvalido',
        newPassword: 'clave',
      });

      expect(result).toEqual({ message: 'Token inválido o expirado.' });
    });
  });
});
