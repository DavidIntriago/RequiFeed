import { Test, TestingModule } from '@nestjs/testing';
import { UsuarioService } from './usuario.service';
import { PrismaService } from 'src/db/prisma.service';

describe('UsuarioService - findUsersByRol', () => {
  let service: UsuarioService;

  const mockPrisma = {
    usuario: {
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsuarioService,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
      ],
    }).compile();

    service = module.get<UsuarioService>(UsuarioService);
    (service as any).prisma = mockPrisma;
  });

  afterEach(() => jest.clearAllMocks());

  it('debería retornar usuarios con rol ANALISTA y LIDER', async () => {
    // Mocks por orden de llamada: ANALISTA primero, LIDER después
    mockPrisma.usuario.findMany
      .mockResolvedValueOnce([
        {
          id: 1,
          nombre: 'Analista Uno',
          cuenta: { Rol: { tipo: 'ANALISTA' } },
        },
      ])
      .mockResolvedValueOnce([
        {
          id: 2,
          nombre: 'Líder Uno',
          cuenta: { id: 99 },
        },
      ]);

    const result = await service.findUsersByRol();

    expect(result.data.analistas).toHaveLength(1);
    expect(result.data.lider).toHaveLength(1);
    expect(result.data.analistas[0].nombre).toBe('Analista Uno');
    expect(result.data.lider[0].nombre).toBe('Líder Uno');

    // Validar que se llamó correctamente con los filtros esperados
    expect(mockPrisma.usuario.findMany).toHaveBeenNthCalledWith(1, {
      where: {
        cuenta: {
          Rol: {
            tipo: 'ANALISTA',
          },
        },
      },
      include: {
        cuenta: {
          include: {
            Rol: true,
          },
        },
      },
    });

    expect(mockPrisma.usuario.findMany).toHaveBeenNthCalledWith(2, {
      where: {
        cuenta: {
          Rol: {
            tipo: 'LIDER',
          },
        },
      },
      include: {
        cuenta: true,
      },
    });
  });
});
