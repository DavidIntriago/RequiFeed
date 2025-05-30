import { Test, TestingModule } from '@nestjs/testing';
import { CuentaService } from './cuenta.service';
import { BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/db/prisma.service';
import * as jwt from 'jsonwebtoken';

describe('AuthService', () => {
  let service: CuentaService;

  const mockPrisma = {
    cuenta: {
      findFirst: jest.fn(),
      create: jest.fn(),
    },
    rol: {
      findFirst: jest.fn(),
    },
    usuario: {
      create: jest.fn(),
    },
    $transaction: jest.fn().mockImplementation(async (cb) => cb(mockPrisma)),
  };

  beforeEach(async () => {
    jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashed-password');

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CuentaService,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
      ],
    }).compile();

    service = module.get<CuentaService>(CuentaService);
    (service as any).prisma = mockPrisma;
  });

  afterEach(() => jest.clearAllMocks());

  it('debería registrar un usuario correctamente', async () => {
    // Simulaciones
    mockPrisma.cuenta.findFirst.mockResolvedValue(null); // email no existe
    mockPrisma.rol.findFirst.mockResolvedValue({ id: 1 }); // rol ANALISTA
    mockPrisma.cuenta.create.mockResolvedValue({
      id: 1,
      email: 'test@email.com',
      estado: 'ACTIVA',
      Rol: { tipo: 'ANALISTA' },
    });

    mockPrisma.usuario.create.mockResolvedValue({
      id: 1,
      nombre: 'Juan',
      apellido: 'Pérez',
      ocupacion: 'Analista',
      area: 'TI',
      cuentaId: 1,
      cuenta: { email: 'test@email.com' },
    });

    // Llamada al método
    const result = await service.registry({
      email: 'test@email.com',
      contrasenia: '123456',
      nombre: 'Juan',
      apellido: 'Pérez',
      ocupacion: 'Analista',
      area: 'TI',
      foto: null,
    });

    // Verificaciones
    expect(result.data.usuario.nombre).toBe('Juan');
    expect(result.data.cuenta.estado).toBe('ACTIVA');
    expect(bcrypt.hash).toHaveBeenCalledWith('123456', 10);
  });
});

describe('CuentaService - login', () => {
  let service: CuentaService;

  const mockPrisma = {
    cuenta: {
      findFirst: jest.fn(),
    },
    usuario: {
      findFirst: jest.fn(),
    },
  };

  beforeEach(async () => {
    jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);
jest.spyOn(jwt, 'sign').mockImplementation(() => 'fake-jwt-token');

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CuentaService,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
      ],
    }).compile();

    service = module.get<CuentaService>(CuentaService);
    (service as any).prisma = mockPrisma;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('debería devolver token y datos del usuario si las credenciales son correctas', async () => {
    // 1. Mock de la cuenta
    mockPrisma.cuenta.findFirst.mockResolvedValue({
      id: 1,
      email: 'test@email.com',
      contrasenia: 'hashed-pass',
      external_id: 'external123',
      Rol: { tipo: 'ANALISTA' },
    });

    // 2. Mock del usuario relacionado
    mockPrisma.usuario.findFirst.mockResolvedValue({
      nombre: 'Juan',
      apellido: 'Pérez',
    });

    const result = await service.login({
      email: 'test@email.com',
      contrasenia: '123456',
    });

    expect(result.data.token).toBe('fake-jwt-token');
    expect(result.data.usuario).toBe('Juan Pérez');
    expect(result.data.rol).toBe('ANALISTA');
  });

  it('debería lanzar error si la cuenta no existe', async () => {
    mockPrisma.cuenta.findFirst.mockResolvedValue(null);

    await expect(service.login({
      email: 'noexiste@email.com',
      contrasenia: '123456',
    })).rejects.toThrow('Credenciales incorrectas');
  });

  it('debería lanzar error si la contraseña es incorrecta', async () => {
    mockPrisma.cuenta.findFirst.mockResolvedValue({
      id: 1,
      email: 'test@email.com',
      contrasenia: 'hashed-pass',
      external_id: 'external123',
      Rol: { tipo: 'ANALISTA' },
    });

    jest.spyOn(bcrypt, 'compare').mockResolvedValue(false); // contraseña no coincide

    await expect(service.login({
      email: 'test@email.com',
      contrasenia: 'wrongpass',
    })).rejects.toThrow('Credenciales incorrectas');
  });

  it('debería devolver token y sin usuario si no hay registro de usuario', async () => {
    mockPrisma.cuenta.findFirst.mockResolvedValue({
      id: 1,
      email: 'test@email.com',
      contrasenia: 'hashed-pass',
      external_id: 'external123',
      Rol: { tipo: 'ANALISTA' },
    });

    jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);
    mockPrisma.usuario.findFirst.mockResolvedValue(null); // no hay usuario

    const result = await service.login({
      email: 'test@email.com',
      contrasenia: '123456',
    });

    expect(result.data.token).toBe('fake-jwt-token');
    expect(result.data.usuario).toBeUndefined();
    expect(result.data.rol).toBe('ANALISTA');
  });
});

describe('CuentaService - changePassword', () => {
  let service: CuentaService;

  const mockPrisma = {
    cuenta: {
      findFirst: jest.fn(),
      update: jest.fn(),
    },
  };

  beforeEach(async () => {
    jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);
    jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashed-new-password');

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CuentaService,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
      ],
    }).compile();

    service = module.get<CuentaService>(CuentaService);
    (service as any).prisma = mockPrisma;
  });

  afterEach(() => jest.clearAllMocks());

  it('debería cambiar la contraseña correctamente si todo es válido', async () => {
    mockPrisma.cuenta.findFirst.mockResolvedValue({
      external_id: 'ext123',
      contrasenia: 'hashed-old-password',
    });

    mockPrisma.cuenta.update.mockResolvedValue({
      external_id: 'ext123',
      contrasenia: 'hashed-new-password',
    });

    const result = await service.changePassword('ext123', {
      email: "admin@admin.com",
    contraseniaActual: "adminnnnnn",
    contrasenia:"admin3",
    contraseniaConfirm:"admin3"
    });

    expect(result.data.contrasenia).toBe('hashed-new-password');
    expect(bcrypt.compare).toHaveBeenCalled();
    expect(bcrypt.hash).toHaveBeenCalled();
    expect(mockPrisma.cuenta.update).toHaveBeenCalledWith({
      where: { external_id: 'ext123' },
      data: { contrasenia: 'hashed-new-password' },
    });
  });

  it('debería lanzar error si la cuenta no existe', async () => {
    mockPrisma.cuenta.findFirst.mockResolvedValue(null);

    await expect(
      service.changePassword('ext999', {
         email: "admin@admin.com",
    contraseniaActual: "adminnnnnn",
    contrasenia:"admin3",
    contraseniaConfirm:"admin3"
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('debería lanzar error si la contraseña actual es incorrecta', async () => {
    mockPrisma.cuenta.findFirst.mockResolvedValue({
      external_id: 'ext123',
      contrasenia: 'hashed-old-password',
    });

    jest.spyOn(bcrypt, 'compare').mockResolvedValue(false); // contraseña no coincide

    await expect(
      service.changePassword('ext123', {
         email: "admin@admin.com",
    contraseniaActual: "adminnnnnn",
    contrasenia:"admin3",
    contraseniaConfirm:"admin3"
      }),
    ).rejects.toThrow('Contraseña actual incorrecta');
  });

  it('debería lanzar error si las nuevas contraseñas no coinciden', async () => {
    mockPrisma.cuenta.findFirst.mockResolvedValue({
      external_id: 'ext123',
      contrasenia: 'hashed-old-password',
    });

    jest.spyOn(bcrypt, 'compare').mockResolvedValue(true); // contraseña actual sí coincide

    await expect(
      service.changePassword('ext123', {
         email: "admin@admin.com",
    contraseniaActual: "adminnnnnn",
    contrasenia:"admin31",
    contraseniaConfirm:"admin3"
      }),
    ).rejects.toThrow('Las contraseñas no coinciden');
  });
});

describe('CuentaService - update', () => {
  let service: CuentaService;

  const mockPrisma = {
    cuenta: {
      findFirst: jest.fn(),
      update: jest.fn(),
    },
    usuario: {
      update: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CuentaService,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
      ],
    }).compile();

    service = module.get<CuentaService>(CuentaService);
    (service as any).prisma = mockPrisma;
  });

  afterEach(() => jest.clearAllMocks());

  it('debería actualizar cuenta y usuario si el email no está en uso', async () => {
    const external_id = 'ext123';

    mockPrisma.cuenta.findFirst.mockResolvedValue(null); // no hay conflicto de email

    mockPrisma.cuenta.update.mockResolvedValue({
      id: 1,
      email: 'nuevo@email.com',
    });

    mockPrisma.usuario.update.mockResolvedValue({
      nombre: 'NuevoNombre',
      apellido: 'NuevoApellido',
    });

    await service.update(external_id, {
      id: '123',
      nombre: 'NuevoNombre',
      apellido: 'NuevoApellido',
      email: 'nuevo@email.com',
      ocupacion: 'Dev',
      area: 'TI',
      foto: 'foto.jpg',
      estado: 'ACTIVA',
    });

    expect(mockPrisma.cuenta.findFirst).toHaveBeenCalledWith({
      where: {
        email: 'nuevo@email.com',
        NOT: { external_id: 'ext123' },
      },
    });

    expect(mockPrisma.cuenta.update).toHaveBeenCalledWith({
      where: { external_id },
      data: {
        email: 'nuevo@email.com',
        estado: 'ACTIVA',
      },
    });

    expect(mockPrisma.usuario.update).toHaveBeenCalledWith({
      where: { cuentaId: 1 },
      data: {
        nombre: 'NuevoNombre',
        apellido: 'NuevoApellido',
        ocupacion: 'Dev',
        area: 'TI',
        foto: 'foto.jpg',
      },
    });
  });

  it('debería lanzar error si el correo ya está en uso por otra cuenta', async () => {
    mockPrisma.cuenta.findFirst.mockResolvedValue({ id: 999 });

    await expect(
      service.update('ext123', {
        id: '123',
        nombre: 'Juan',
        apellido: 'Pérez',
        email: 'usado@email.com',
        ocupacion: 'Dev',
        area: 'TI',
        foto: 'foto.jpg',
        estado: 'ACTIVA',
      }),
    ).rejects.toThrow('El correo electrónico ya está en uso');
  });
});

describe('CuentaService - cambiarRol', () => {
  let service: CuentaService;

  const mockPrisma = {
    rol: {
      findFirst: jest.fn(),
    },
    cuenta: {
      update: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CuentaService,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
      ],
    }).compile();

    service = module.get<CuentaService>(CuentaService);
    (service as any).prisma = mockPrisma;
  });

  afterEach(() => jest.clearAllMocks());

  it('debería cambiar el rol de una cuenta si el rol existe', async () => {
    mockPrisma.rol.findFirst.mockResolvedValue({ id: 2, tipo: 'ANALISTA' });

    mockPrisma.cuenta.update.mockResolvedValue({
      external_id: 'ext456',
      rolId: 2,
    });

    const result = await service.cambiarRol('ext456', {
      rolType: 'ANALISTA',
    });

    expect(result.data.cuenta.rolId).toBe(2);
    expect(mockPrisma.rol.findFirst).toHaveBeenCalledWith({
      where: { tipo: 'ANALISTA' },
    });
    expect(mockPrisma.cuenta.update).toHaveBeenCalledWith({
      where: { external_id: 'ext456' },
      data: { rolId: 2 },
    });
  });

  it('debería lanzar error si el rol no existe', async () => {
    mockPrisma.rol.findFirst.mockResolvedValue(null);

    await expect(
      service.cambiarRol('ext999', {
        rolType: 'ANALISTA',
      }),
    ).rejects.toThrow('Rol no encontrado');
  });
});


describe('CuentaService - findAll y findOne', () => {
  let service: CuentaService;

  const mockPrisma = {
    cuenta: {
      count: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CuentaService,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
      ],
    }).compile();

    service = module.get<CuentaService>(CuentaService);
    (service as any).prisma = mockPrisma;
  });

  afterEach(() => jest.clearAllMocks());

  it('debería retornar una lista paginada de cuentas', async () => {
    mockPrisma.cuenta.count.mockResolvedValue(10);
    mockPrisma.cuenta.findMany.mockResolvedValue([
      { id: 1, email: 'a@email.com' },
      { id: 2, email: 'b@email.com' },
    ]);

    const result = await service.findAll({ page: 1, limit: 2 });

    expect(result.data.length).toBe(2);
    expect(result.meta.total).toBe(10);
    expect(result.meta.page).toBe(1);
    expect(result.meta.lastPage).toBe(5);

    expect(mockPrisma.cuenta.findMany).toHaveBeenCalledWith({
      skip: 0,
      take: 2,
      include: {
        Rol: true,
        usuario: true,
      },
    });
  });

  it('debería retornar una cuenta si el external_id existe', async () => {
    mockPrisma.cuenta.findFirst.mockResolvedValue({
      id: 1,
      external_id: 'ext123',
      email: 'test@email.com',
      usuario: { nombre: 'Juan' },
    });

    const result = await service.findOne('ext123');

    expect(result.data.email).toBe('test@email.com');
    expect(result.data.usuario.nombre).toBe('Juan');
    expect(mockPrisma.cuenta.findFirst).toHaveBeenCalledWith({
      where: { external_id: 'ext123' },
      include: {
        usuario: true,
      },
    });
  });

  it('debería lanzar error si el external_id no existe', async () => {
    mockPrisma.cuenta.findFirst.mockResolvedValue(null);

    await expect(service.findOne('noexiste')).rejects.toThrow('Usuario no encontrado');
  });
});