import { Test, TestingModule } from '@nestjs/testing';
import { RequisitoController } from './requisito.controller';
import { RequisitoService } from './requisito.service';

describe('RequisitoController', () => {
  let controller: RequisitoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RequisitoController],
      providers: [RequisitoService],
    }).compile();

    controller = module.get<RequisitoController>(RequisitoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
