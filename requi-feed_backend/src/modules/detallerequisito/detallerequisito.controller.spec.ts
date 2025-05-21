import { Test, TestingModule } from '@nestjs/testing';
import { DetallerequisitoController } from './detallerequisito.controller';
import { DetallerequisitoService } from './detallerequisito.service';

describe('DetallerequisitoController', () => {
  let controller: DetallerequisitoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DetallerequisitoController],
      providers: [DetallerequisitoService],
    }).compile();

    controller = module.get<DetallerequisitoController>(DetallerequisitoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
