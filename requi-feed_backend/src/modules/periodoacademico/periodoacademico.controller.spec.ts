import { Test, TestingModule } from '@nestjs/testing';
import { PeriodoacademicoController } from './periodoacademico.controller';
import { PeriodoacademicoService } from './periodoacademico.service';

describe('PeriodoacademicoController', () => {
  let controller: PeriodoacademicoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PeriodoacademicoController],
      providers: [PeriodoacademicoService],
    }).compile();

    controller = module.get<PeriodoacademicoController>(PeriodoacademicoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
