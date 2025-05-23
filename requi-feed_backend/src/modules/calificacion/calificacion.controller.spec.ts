import { Test, TestingModule } from '@nestjs/testing';
import { CalificacionController } from './calificacion.controller';
import { CalificacionService } from './calificacion.service';

describe('CalificacionController', () => {
  let controller: CalificacionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CalificacionController],
      providers: [CalificacionService],
    }).compile();

    controller = module.get<CalificacionController>(CalificacionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
