import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { CuentaService } from '../cuenta/cuenta.service';

describe('AuthService', () => {
  let authService: AuthService;
  let jwtService: JwtService;
  let cuentaService: CuentaService;

  // Antes de cada prueba, se crea un entorno de prueba con objetos simulados (mocked)
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          // Simulación del JwtService
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('token_simulado'),
            verify: jest.fn().mockReturnValue({ sub: 'usuario123', email: 'test@correo.com' }),
          },
        },
        {
          // Simulación del servicio CuentaService
          provide: CuentaService,
          useValue: {
            findByEmail: jest.fn((email) =>
              email === 'existe@correo.com'
                ? Promise.resolve({ data: { external_id: 'usuario123', email: 'existe@correo.com' } })
                : Promise.resolve(null)
            ),
          },
        },
      ],
    }).compile();

    // Inyectamos los servicios simulados
    authService = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
    cuentaService = module.get<CuentaService>(CuentaService);
  });

  // Pruebas del método generatePasswordResetToken
  describe('generatePasswordResetToken', () => {
    it('debería retornar un token si el usuario existe', async () => {
      const token = await authService.generatePasswordResetToken('existe@correo.com');
      expect(token).toBe('token_simulado');
    });

    it('debería retornar null si el usuario no existe', async () => {
      const token = await authService.generatePasswordResetToken('noexiste@correo.com');
      expect(token).toBeNull();
    });
  });

  // Pruebas del método verifyPasswordResetToken
  describe('verifyPasswordResetToken', () => {
    it('debería retornar los datos si el token es válido', async () => {
      const resultado = await authService.verifyPasswordResetToken('token_valido');
      expect(resultado).toEqual({ sub: 'usuario123', email: 'test@correo.com' });
    });

    it('debería retornar null si el token es inválido', async () => {
      jest.spyOn(jwtService, 'verify').mockImplementationOnce(() => {
        throw new Error('Token inválido');
      });
      const resultado = await authService.verifyPasswordResetToken('token_invalido');
      expect(resultado).toBeNull();
    });
  });
});
