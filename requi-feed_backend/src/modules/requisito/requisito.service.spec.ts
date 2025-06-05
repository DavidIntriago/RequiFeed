import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../db/prisma.service';
import { PaginationDto } from 'src/common';
import { RequisitoService } from './requisito.service';
import { ListaTipoRequisito } from './enums/requisito-tipo.dto';
import { ListaEstadoRequisito } from './enums/requisito-estado.dto';
import { ListaPrioridadRequisito } from './enums/requisito-prioridad.dto';

const mockPrisma = {

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
    count: jest.fn(),

  },
  grupo: {
    create: jest.fn()
  }
};

describe('RequisitoService', () => {
  let service: RequisitoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RequisitoService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<RequisitoService>(RequisitoService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('debe crear un requisito', async () => {
    mockPrisma.requisito.findFirst.mockResolvedValue(null);
    mockPrisma.requisito.create.mockResolvedValue({
      numeroRequisito: '1',
      tipo: ListaTipoRequisito[0],
      estado: ListaEstadoRequisito[2],
      proyectoId: 1,
      detalleRequisito: [
        {
          nombreRequisito: "Inicio de sesión",
          prioridad: ListaPrioridadRequisito[0],
          descripcion: "Descripcion",
          version: "1.0"
        }
      ]
    });

    const dto = {
      numeroRequisito: '1',
      tipo: ListaTipoRequisito[0],
      estado: ListaEstadoRequisito[2],
      proyectoId: 1,
      detalleRequisito: [
        {
          nombreRequisito: "Inicio de sesión",
          prioridad: ListaPrioridadRequisito[0],
          descripcion: "Descripcion",
          version: "1.0"
        }
      ]
    };

    const result = await service.create(dto);
    expect(result.numeroRequisito).toBe('1');
    expect(result.proyectoId).toBe(1);
  });


it('debe retornar todos los requisitos', async () => {

  // Mock para findMany
  mockPrisma.requisito.findMany.mockResolvedValue([
    { 
      numeroRequisito: '1',
      tipo: ListaTipoRequisito[0],
      estado: ListaEstadoRequisito[2],
      proyectoId: 1,
      detalleRequisito: [
        {
          nombreRequisito: "Inicio de sesión",
          prioridad: ListaPrioridadRequisito[0],
          descripcion: "Descripcion",
          version: "1.0"
        }
      ]
    },
  ]);

  // Mock para count
//   mockPrisma.proyecto.count.mockResolvedValue(1);

  const result = await service.findAll({ page: 1, limit: 2 });
  expect(result.data.length).toBe(1);
});


  it('debe actualizar el requisito', async () => {
    mockPrisma.requisito.findFirst.mockResolvedValue(null);
    mockPrisma.requisito.update.mockResolvedValue({
        external_id: "2ba14091-cf0e-440a-bf58-8dce529cdf5a",
        numeroRequisito: '1',
        tipo: ListaTipoRequisito[0],
        estado: ListaEstadoRequisito[2],
        proyectoId: 1,
        detalleRequisito: [
          {
            nombreRequisito: "Inicio de sesión",
            prioridad: ListaPrioridadRequisito[0],
            descripcion: "Descripcion",
            version: "1.0"
          }
        ]
    });

    const dto = {
        nombre: 'Gestion de requisitos',
        numeroRequisito: '1',
        tipo: ListaTipoRequisito[0],
        estado: ListaEstadoRequisito[2],
        proyectoId: 1,
        detalleRequisito: [
          {
            nombreRequisito: "Inicio de sesión",
            prioridad: ListaPrioridadRequisito[0],
            descripcion: "Descripcion",
            version: "1.0"
          }
        ]
    };

    const result = await service.update("2ba14091-cf0e-440a-bf58-8dce529cdf5a", dto);
    expect(result.data.proyecto.numeroRequisito).toBe('1');
  });

//   it('debe eliminar un proyecto junto con sus requisitos y detalles', async () => {
//     const externalId = '2ba14091-cf0e-440a-bf58-8dce529cdf5a';

//     const proyectoMock = {
//         id: 1,
//         external_id: externalId,
//         nombre: 'Test Proyecto',
//         descripcion: 'Descripcioonn',
//         fechaCreacion: '2025-05-27T10:29:48.381Z',
//         estado: 'INACTIVO',
//         grupoId: 1,
//         calificacionId: null,
//         requisitos: [
//             {
//             id: 101,
//             detalleRequisito: [
//                 { id: 1001 },
//                 { id: 1002 }
//             ]
//             },
//             {
//             id: 102,
//             detalleRequisito: [
//                 { id: 1003 }
//             ]
//             }
//         ]
//         };

//     mockPrisma.proyecto.findUnique.mockResolvedValue(proyectoMock);
//     mockPrisma.detalleRequisito.delete.mockResolvedValue({});
//     mockPrisma.requisito.delete.mockResolvedValue({});
//     mockPrisma.proyecto.delete.mockResolvedValue({ external_id: externalId });

//     const result = await service.remove(externalId);

//     expect(mockPrisma.detalleRequisito.delete).toHaveBeenCalledTimes(3);
//     expect(mockPrisma.requisito.delete).toHaveBeenCalledTimes(2);
//     expect(mockPrisma.proyecto.delete).toHaveBeenCalledWith({
//     where: { external_id: externalId }
//     });

//     expect(result.external_id).toBe(externalId);
//   });
});