import { Test, TestingModule } from '@nestjs/testing';
import { DetallerequisitoService } from './detallerequisito.service';

describe('DetallerequisitoService', () => {
  let service: DetallerequisitoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DetallerequisitoService],
    }).compile();

    service = module.get<DetallerequisitoService>(DetallerequisitoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
