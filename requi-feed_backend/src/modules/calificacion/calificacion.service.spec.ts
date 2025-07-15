import { Test, TestingModule } from '@nestjs/testing';
import { CalificacionService } from './calificacion.service';
import { CreateCalificacionDto } from './dto/create-calificacion.dto';
import { PrismaService } from 'src/db/prisma.service';

const mockPrisma = {
  calificacion: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findFirst: jest.fn(),
    count: jest.fn(),
  },
};

describe('CalificacionService', () => {
  let service: CalificacionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CalificacionService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<CalificacionService>(CalificacionService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('debe crear una calificación', async () => {
    mockPrisma.calificacion.findFirst.mockResolvedValue(null);
    mockPrisma.calificacion.create.mockResolvedValue({
      //   id: 1,
      // external_id: '1234567890',
      puntuacion: 8.9,
      notaMaxima: 2.5,
      comentario: 'Buen trabajo',
      proyectoId : 10,
    });
  
    const dto = {
    //   id: 1,
      // external_id: '1234567890',
      puntuacion: 8.9,
      notaMaxima: 2.5,
      comentario: 'Buen trabajo',
      proyectoId : "198912",
    };
    const result = await service.create(dto);
    expect(result.comentario).toBe('Buen trabajo');
  });

  it('debe retornar todas las calificacion', async () => {
  
    // Mock para findMany
    mockPrisma.calificacion.findMany.mockResolvedValue([
      { 
        puntuacion: 8.9,
        notaMaxima: 2.5,
        comentario: 'Buen trabajo',
        proyectoId : "198912"
      },
    ]);
  
    // Mock para count
  //   mockPrisma.proyecto.count.mockResolvedValue(1);
  
    const result = await service.findAll({ page: 1, limit: 2 });
    expect(result.data.length).toBe(1);
  });

  it('debe actualizar la calificación', async () => {
    mockPrisma.calificacion.findFirst.mockResolvedValue(null);
    mockPrisma.calificacion.update.mockResolvedValue({
      external_id: "2ba14091-cf0e-440a-bf58-8dce529cdf5a",
      puntuacion: 8.9,
      notaMaxima: 2.5,
      comentario: 'Buen trabajo actualizado',
      proyectoId : "198912"
    });
    const dto = {
      puntuacion: 8.9,
      notaMaxima: 2.5,
      comentario: 'Buen trabajo actualizado',
      proyectoId : "198912"
      // grupoId: 1,
    };
  
    const result = await service.update("2ba14091-cf0e-440a-bf58-8dce529cdf5a", dto);
    expect(result.data.comentario).toBe('Buen trabajo actualizado');
  });

  
});
