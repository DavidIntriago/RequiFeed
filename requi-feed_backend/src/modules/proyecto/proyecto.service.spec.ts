import { Test, TestingModule } from '@nestjs/testing';
import { ProyectoService } from './proyecto.service';
import { EstadoProyecto, PrismaClient, Proyecto } from '@prisma/client';
import { CreateProyectoDto as UpdateProyectoDto } from './dto/create-proyecto.dto';

describe('ProyectoService', () => {
  let service: ProyectoService;
  let mockPrisma: {
    proyecto: {
      create: jest.Mock;
      findMany: jest.Mock;
      findFirst: jest.Mock;
      update: jest.Mock;
      delete: jest.Mock;
      count: jest.Mock;
    };
  };

  beforeEach(async () => {
    mockPrisma = {
      proyecto: {
        create: jest.fn(),
        findMany: jest.fn(),
        findFirst: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        count: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProyectoService,
        {
          provide: PrismaClient,
          useValue: mockPrisma, // ¡esto ya es un mock válido!
        },
      ],
    }).compile();

    service = module.get<ProyectoService>(ProyectoService);
  });

  it('Crear proyecto', async () => {
    const dto: UpdateProyectoDto = {
      nombre: 'Test Proyecto',
      descripcion: 'Desc',
      estado: EstadoProyecto.ACTIVO,
      grupoId: 1,
    };
    const mockFecha = new Date('2025-01-01T00:00:00.000Z');
    const mockUuid = 'abc-123';
    const expected: Proyecto = {
      id: 1,
      nombre: dto.nombre,
      descripcion: dto.descripcion,
      estado: dto.estado,
      grupoId: dto.grupoId,
      external_id: mockUuid,
      fechaCreacion: mockFecha,
      calificacionId: null,
      // createdAt: new Date(),
      // updatedAt:  Date(),
    };

    mockPrisma.proyecto.create.mockResolvedValue(expected);

    const result = await service.create(dto);
    // expect(result).toEqual(expected);
    console.log(result)
    expect(result).toEqual(expect.objectContaining({
      nombre: dto.nombre,
      descripcion: dto.descripcion,
      estado: dto.estado,
      grupoId: dto.grupoId,
    }));

  });

//   it('Actualizar proyecto', async () => {
//   const dto: UpdateProyectoDto = {
//     nombre: 'Test Proyecto Actualizado',
//     descripcion: 'Desc Actualizada',
//     estado: EstadoProyecto.INACTIVO,
//     grupoId: 2,
//   };
//   const mockFecha = new Date('2025-01-01T00:00:00.000Z');
//   const mockUuid = 'abc-123';

//   const expected: Proyecto = {
//     id: 1,
//     nombre: dto.nombre,
//     descripcion: dto.descripcion,
//     estado: dto.estado,
//     grupoId: dto.grupoId,
//     external_id: mockUuid,
//     fechaCreacion: mockFecha,
//     calificacionId: null,
//   };

//   mockPrisma.proyecto.update.mockResolvedValue(expected);

//   const result = await service.update(mockUuid, dto);

//   expect(mockPrisma.proyecto.update).toHaveBeenCalledWith({
//     where: { external_id: mockUuid },
//     data: dto,
//   });

//   expect(result).toEqual(expect.objectContaining({
//     nombre: dto.nombre,
//     descripcion: dto.descripcion,
//     estado: dto.estado,
//     grupoId: dto.grupoId,
//   }));
// });
});
