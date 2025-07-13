import { Test, TestingModule } from '@nestjs/testing';
import { GrupoService } from './grupo.service';
import { PrismaService } from 'src/db/prisma.service';
import { CreateGrupoDto } from './dto/create-grupo.dto';

const mockPrismaService = {
  rol: {
    findFirst: jest.fn(),
  },
  cuenta: {
    findMany: jest.fn(),
  },
  usuario: {
    update: jest.fn(),
    findMany: jest.fn(),
  },
  grupo: {
    create: jest.fn(),
  },
  $transaction: jest.fn((cb) => cb(mockPrismaService)),
};

describe('GrupoService', () => {
  let service: GrupoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GrupoService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<GrupoService>(GrupoService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createGroupsbyRamdom', () => {
    it('should create random groups correctly', async () => {
      const dto: CreateGrupoDto = {
        nombre: 'Grupo',
        cantidadGrupos: 2,
        idPeriodoAcademico: 1,
      } as CreateGrupoDto;

      mockPrismaService.rol.findFirst.mockResolvedValue({ id: 1 });
      mockPrismaService.cuenta.findMany.mockResolvedValue([
        { usuario: { id: 1 } },
        { usuario: { id: 2 } },
        { usuario: { id: 3 } },
      ]);
      mockPrismaService.grupo.create.mockImplementation(({ data }) => Promise.resolve({ ...data, id: Math.random() }));
      mockPrismaService.usuario.update.mockResolvedValue({});

      const result = await service.createGroupsbyRamdom(dto);

      expect(result.length).toBe(dto.cantidadGrupos);
      expect(mockPrismaService.grupo.create).toHaveBeenCalledTimes(dto.cantidadGrupos);
      expect(mockPrismaService.usuario.update).toHaveBeenCalled();
    });

    it('should throw error if no ANALISTA role found', async () => {
      mockPrismaService.rol.findFirst.mockResolvedValue(null);

      await expect(
        service.createGroupsbyRamdom({ cantidadGrupos: 1, idPeriodoAcademico: 1, nombre: 'Grupo' } as CreateGrupoDto)
      ).rejects.toThrow('Rol ANALISTA no encontrado');
    });

    it('should throw error if no users found', async () => {
      mockPrismaService.rol.findFirst.mockResolvedValue({ id: 1 });
      mockPrismaService.cuenta.findMany.mockResolvedValue([]);

      await expect(
        service.createGroupsbyRamdom({ cantidadGrupos: 1, idPeriodoAcademico: 1, nombre: 'Grupo' } as CreateGrupoDto)
      ).rejects.toThrow('No hay usuarios con rol ANALISTA');
    });
  });

  describe('create', () => {
    it('should create a manual group with users', async () => {
      const dto = {
        nombre: 'Grupo Manual',
        descripcion: 'Descripción',
        cantidadGrupos: 1,
        idPeriodoAcademico: 1,
        usuarios: [1, 2, 3],
        proyectos: [],
      };

      mockPrismaService.usuario.findMany.mockResolvedValue([
        { id: 1 },
        { id: 2 },
        { id: 3 },
      ]);
      mockPrismaService.grupo.create.mockResolvedValue({ id: 1 });
      mockPrismaService.usuario.update.mockResolvedValue({});

      const result = await service.create(dto);

      expect(result).toHaveProperty('id');
      expect(mockPrismaService.grupo.create).toHaveBeenCalled();
      expect(mockPrismaService.usuario.update).toHaveBeenCalledTimes(3);
    });

    it('should throw error if some users do not exist', async () => {
      const dto: CreateGrupoDto = {
        nombre: 'Grupo Manual',
        descripcion: 'Descripción',
        cantidadGrupos: 1,
        idPeriodoAcademico: 1,
        usuarios: [1, 2, 3],
        proyectos: [],
      };

      mockPrismaService.usuario.findMany.mockResolvedValue([{ id: 1 }]);

      await expect(service.create(dto)).rejects.toThrow('Algunos usuarios no existen');
    });
  });
});
