import { Test, TestingModule } from '@nestjs/testing';
import { PeriodoacademicoService } from './periodoacademico.service';

describe('PeriodoacademicoService', () => {
  let service: PeriodoacademicoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PeriodoacademicoService],
    }).compile();

    service = module.get<PeriodoacademicoService>(PeriodoacademicoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
