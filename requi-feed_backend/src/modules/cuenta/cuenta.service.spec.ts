import { Test, TestingModule } from '@nestjs/testing';
import { CuentaService } from './cuenta.service';
import { PrismaService } from 'src/db/prisma.service';
import * as bcrypt from 'bcrypt';
import { BadRequestException } from '@nestjs/common';

jest.mock('bcrypt');
jest.mock('jsonwebtoken');


describe('CuentaService', () => {
  let service: CuentaService;
  let prisma: PrismaService;

  const mockPrismaService = {
    cuenta: {
      findFirst: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CuentaService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<CuentaService>(CuentaService);
    prisma = module.get<PrismaService>(PrismaService);

    jest.clearAllMocks();
  });

  describe('findByEmail', () => {
    it('debe retornar una cuenta válida si existe', async () => {
      const email = 'test@example.com';
      const mockCuenta = { id: 1, email };

      mockPrismaService.cuenta.findFirst.mockResolvedValue(mockCuenta);

      const result = await service.findByEmail(email);

      expect(result).toEqual({ data: mockCuenta });
      expect(mockPrismaService.cuenta.findFirst).toHaveBeenCalledWith({ where: { email } });
    });

    it('debe lanzar excepción si no se encuentra la cuenta', async () => {
      mockPrismaService.cuenta.findFirst.mockResolvedValue(null);

      await expect(service.findByEmail('noexiste@example.com')).rejects.toThrow(BadRequestException);
    });
  });

  describe('updateContrasenia', () => {
    it('debe actualizar la contraseña correctamente si existe la cuenta', async () => {
      const email = 'test@example.com';
      const nuevaContrasenia = 'nueva123';
      const cuentaMock = { id: 1, email };

      mockPrismaService.cuenta.findUnique.mockResolvedValue(cuentaMock);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-password');
      mockPrismaService.cuenta.update.mockResolvedValue({ ...cuentaMock, contrasenia: 'hashed-password' });

      const result = await service.updateContrasenia(email, nuevaContrasenia);

      expect(mockPrismaService.cuenta.findUnique).toHaveBeenCalledWith({ where: { email } });
      expect(mockPrismaService.cuenta.update).toHaveBeenCalledWith({
        where: { email },
        data: { contrasenia: 'hashed-password' },
      });
      expect(result).toEqual({ ...cuentaMock, contrasenia: 'hashed-password' });
    });

    it('debe lanzar excepción si la cuenta no existe', async () => {
      mockPrismaService.cuenta.findUnique.mockResolvedValue(null);

      await expect(service.updateContrasenia('inexistente@example.com', '123')).rejects.toThrow(BadRequestException);
    });
  });

  
});
