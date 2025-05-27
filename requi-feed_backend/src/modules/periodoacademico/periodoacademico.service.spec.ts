import { Test, TestingModule } from '@nestjs/testing';
import { PeriodoacademicoService } from './periodoacademico.service';
import { PrismaService } from '../../db/prisma.service';

const mockPrisma = {
  periodoAcademico: {
    findFirst: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
};

describe('PeriodoacademicoService', () => {
  let service: PeriodoacademicoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PeriodoacademicoService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<PeriodoacademicoService>(PeriodoacademicoService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('debe crear un periodo académico si no hay duplicado', async () => {
    mockPrisma.periodoAcademico.findFirst.mockResolvedValue(null);
    mockPrisma.periodoAcademico.create.mockResolvedValue({
      id: 1,
      nombre: 'Periodo 2025-A',
      modalidad: 'Presencial',
      fechaInicio: new Date('2025-01-01'),
      fechaFin: new Date('2025-06-30'),
    });

    const dto = {
      nombre: 'Periodo 2025-A',
      modalidad: 'Presencial',
      fechaInicio: new Date('2025-01-01'),
      fechaFin: new Date('2025-06-30'),
    };

    const result = await service.createPeriodoAcademico(dto);
    expect(result.data.nombre).toBe('Periodo 2025-A');
  });

  it('debe retornar mensaje si ya existe periodo con las mismas fechas', async () => {
    mockPrisma.periodoAcademico.findFirst.mockResolvedValue({ id: 1 });

    const dto = {
      nombre: 'Periodo 2025-A',
      modalidad: 'Presencial',
      fechaInicio: new Date('2025-01-01'),
      fechaFin: new Date('2025-06-30'),
    };

    const result = await service.createPeriodoAcademico(dto);
    expect(result).toEqual({
      message: 'Ya existe un periodo academico con las mismas fechas',
    });
  });

  it('debe retornar todos los periodos ordenados por fechaInicio desc', async () => {
    mockPrisma.periodoAcademico.findMany.mockResolvedValue([
      { id: 1, nombre: 'Periodo 2025-A', fechaInicio: new Date(), fechaFin: new Date() },
    ]);

    const result = await service.findAll();
    expect(result.data.length).toBe(1);
  });

  it('debe retornar el periodo actual si hoy está entre las fechas', async () => {
    mockPrisma.periodoAcademico.findFirst.mockResolvedValue({
      id: 1,
      nombre: 'Actual',
      fechaInicio: new Date('2025-01-01'),
      fechaFin: new Date('2025-12-31'),
    });

    const result = await service.findPeridoActual();
    expect(result.data.nombre).toBe('Actual');
  });

  it('no debe actualizar si ya existe otro periodo con las mismas fechas', async () => {
    mockPrisma.periodoAcademico.findFirst.mockResolvedValue({ id: 2 });

    const dto = {
      nombre: 'Periodo 2025-B',
      modalidad: 'Virtual',
      fechaInicio: new Date('2025-07-01'),
      fechaFin: new Date('2025-12-31'),
    };

    const result = await service.updatePeriodoAcademico(1, dto);
    expect(result).toEqual({
      message: 'Ya existe un periodo académico con las mismas fechas',
    });
  });

  it('debe actualizar el periodo académico si no hay conflicto', async () => {
    mockPrisma.periodoAcademico.findFirst.mockResolvedValue(null);
    mockPrisma.periodoAcademico.update.mockResolvedValue({
      id: 1,
      nombre: 'Periodo 2025-B',
      modalidad: 'Virtual',
      fechaInicio: new Date('2025-07-01'),
      fechaFin: new Date('2025-12-31'),
    });

    const dto = {
      nombre: 'Periodo 2025-B',
      modalidad: 'Virtual',
      fechaInicio: new Date('2025-07-01'),
      fechaFin: new Date('2025-12-31'),
    };

    const result = await service.updatePeriodoAcademico(1, dto);
    expect(result.data.nombre).toBe('Periodo 2025-B');
  });
});
