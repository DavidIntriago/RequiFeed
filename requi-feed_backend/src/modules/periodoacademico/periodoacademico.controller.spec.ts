import { Test, TestingModule } from '@nestjs/testing';
import { PeriodoacademicoController } from './periodoacademico.controller';
import { PeriodoacademicoService } from './periodoacademico.service';
import { periodoAcademicoDto } from './dto/create-periodoacademico.dto';

describe('PeriodoacademicoController', () => {
  let controller: PeriodoacademicoController;
  let service: PeriodoacademicoService;

  const mockService = {
    createPeriodoAcademico: jest.fn(),
    findPeridoActual: jest.fn(),
    findAll: jest.fn(),
    updatePeriodoAcademico: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PeriodoacademicoController],
      providers: [
        {
          provide: PeriodoacademicoService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<PeriodoacademicoController>(PeriodoacademicoController);
    service = module.get<PeriodoacademicoService>(PeriodoacademicoService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a new periodo academico', async () => {
    const dto: periodoAcademicoDto = {
      nombre: 'Periodo 2025',
      modalidad: 'Presencial',
      fechaInicio: new Date('2025-01-01'),
      fechaFin: new Date('2025-06-30'),
    };
    const mockResponse = { data: { id: 1, ...dto } };
    mockService.createPeriodoAcademico.mockResolvedValue(mockResponse);

    const result = await controller.create(dto);
    expect(result).toEqual(mockResponse);
    expect(service.createPeriodoAcademico).toHaveBeenCalledWith(dto);
  });

  it('should return current periodo academico', async () => {
    const mockResponse = { data: { nombre: 'Periodo actual' } };
    mockService.findPeridoActual.mockResolvedValue(mockResponse);

    const result = await controller.findUltimoPeriodoAcademico();
    expect(result).toEqual(mockResponse);
    expect(service.findPeridoActual).toHaveBeenCalled();
  });

  it('should return all periodos academicos', async () => {
    const mockResponse = { data: ['Periodo 1', 'Periodo 2'] };
    mockService.findAll.mockResolvedValue(mockResponse);

    const result = await controller.findAll();
    expect(result).toEqual(mockResponse);
    expect(service.findAll).toHaveBeenCalled();
  });

  it('should update a periodo academico', async () => {
    const dto: periodoAcademicoDto = {
      nombre: 'Periodo actualizado',
      modalidad: 'Virtual',
      fechaInicio: new Date('2025-02-01'),
      fechaFin: new Date('2025-07-31'),
    };
    const mockResponse = { data: { id: 1, ...dto } };
    mockService.updatePeriodoAcademico.mockResolvedValue(mockResponse);

    const result = await controller.update('1', dto);
    expect(result).toEqual(mockResponse);
    expect(service.updatePeriodoAcademico).toHaveBeenCalledWith(1, dto);
  });
});
