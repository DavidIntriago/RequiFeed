import { Test, TestingModule } from '@nestjs/testing';
import { CalificacionService } from './calificacion.service';

describe('CalificacionService', () => {
  let service: CalificacionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CalificacionService],
    }).compile();

    service = module.get<CalificacionService>(CalificacionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
