import { Test, TestingModule } from '@nestjs/testing';
import { GrupoController } from './grupo.controller';
import { GrupoService } from './grupo.service';

describe('GrupoController', () => {
  let controller: GrupoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GrupoController],
      providers: [GrupoService],
    }).compile();

    controller = module.get<GrupoController>(GrupoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
