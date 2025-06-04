import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../db/prisma.service';
import { ProyectoService } from './proyecto.service';
import { ListaEstadoProyecto } from './enums/proyecto-estado.dto';
import { PaginationDto } from 'src/common';

const mockPrisma = {
  proyecto: {
    findFirst: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findUnique: jest.fn(),
    count: jest.fn(),
  },
  detalleRequisito: {
    findFirst: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  requisito: {
    findFirst: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  grupo: {
    create: jest.fn()
  }
};

describe('ProyectoService', () => {
  let service: ProyectoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProyectoService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<ProyectoService>(ProyectoService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('debe crear un proyecto', async () => {
    mockPrisma.proyecto.findFirst.mockResolvedValue(null);
    mockPrisma.proyecto.create.mockResolvedValue({
    //   id: 1,
      nombre: 'Gestion de requisitos',
      descripcion: 'Enfocado en la UNL 2',
      estado: 'ACTIVO',
      grupoId: ListaEstadoProyecto[0],
    });

    const dto = {
    //   id: 1,
      nombre: 'Gestion de requisitos',
      descripcion: 'Enfocado en la UNL 3',
      estado: ListaEstadoProyecto[0],
      grupoId: 1,
    };

    const result = await service.create(dto);
    expect(result.nombre).toBe('Gestion de requisitos');
  });


it('debe retornar todos los proyectos', async () => {

  // Mock para findMany
  mockPrisma.proyecto.findMany.mockResolvedValue([
    { 
      nombre: 'Gestion de requisitos',
      descripcion: 'Enfocado en la UNL 2',
      estado: ListaEstadoProyecto[0],
      grupoId: 1,
    },
  ]);

  // Mock para count
//   mockPrisma.proyecto.count.mockResolvedValue(1);

  const result = await service.findAll({ page: 1, limit: 2 });
  expect(result.data.length).toBe(1);
});


  it('debe actualizar el proyecto', async () => {
    mockPrisma.proyecto.findFirst.mockResolvedValue(null);
    mockPrisma.proyecto.update.mockResolvedValue({
        external_id: "2ba14091-cf0e-440a-bf58-8dce529cdf5a",
        nombre: 'Gestion de requisitos',
        descripcion: 'Enfocado en la UNL 3',
        estado: ListaEstadoProyecto[0],
        grupoId: 1,
    });

    const dto = {
        nombre: 'Gestion de requisitos',
        descripcion: 'Enfocado en la UNL 3',
        estado: ListaEstadoProyecto[0],
        // grupoId: 1,
    };

    const result = await service.update("2ba14091-cf0e-440a-bf58-8dce529cdf5a", dto);
    expect(result.data.proyecto.descripcion).toBe('Enfocado en la UNL 3');
  });

  it('debe eliminar un proyecto junto con sus requisitos y detalles', async () => {
    const externalId = '2ba14091-cf0e-440a-bf58-8dce529cdf5a';

    const proyectoMock = {
        id: 1,
        external_id: externalId,
        nombre: 'Test Proyecto',
        descripcion: 'Descripcioonn',
        fechaCreacion: '2025-05-27T10:29:48.381Z',
        estado: 'INACTIVO',
        grupoId: 1,
        calificacionId: null,
        requisitos: [
            {
            id: 101,
            detalleRequisito: [
                { id: 1001 },
                { id: 1002 }
            ]
            },
            {
            id: 102,
            detalleRequisito: [
                { id: 1003 }
            ]
            }
        ]
        };

    mockPrisma.proyecto.findUnique.mockResolvedValue(proyectoMock);
    mockPrisma.detalleRequisito.delete.mockResolvedValue({});
    mockPrisma.requisito.delete.mockResolvedValue({});
    mockPrisma.proyecto.delete.mockResolvedValue({ external_id: externalId });

    const result = await service.remove(externalId);

    expect(mockPrisma.detalleRequisito.delete).toHaveBeenCalledTimes(3);
    expect(mockPrisma.requisito.delete).toHaveBeenCalledTimes(2);
    expect(mockPrisma.proyecto.delete).toHaveBeenCalledWith({
    where: { external_id: externalId }
    });

    expect(result.external_id).toBe(externalId);
  });
});