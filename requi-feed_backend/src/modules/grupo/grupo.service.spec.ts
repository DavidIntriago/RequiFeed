import { Test, TestingModule } from '@nestjs/testing';
import { GrupoService } from './grupo.service';

describe('GrupoService', () => {
  let service: GrupoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GrupoService],
    }).compile();

    service = module.get<GrupoService>(GrupoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
