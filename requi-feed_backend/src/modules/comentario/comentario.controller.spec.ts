import { Test, TestingModule } from '@nestjs/testing';
import { ComentarioController } from './comentario.controller';
import { ComentarioService } from './comentario.service';
import { CreateComentarioDto } from './dto/create-comentario.dto';
import { UpdateComentarioDto } from './dto/update-comentario.dto';

describe('ComentarioController', () => {
  let controller: ComentarioController;
  let serviceMock: Partial<Record<keyof ComentarioService, jest.Mock>>;

  beforeEach(async () => {
    serviceMock = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
      findByRequisitoExternalId: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ComentarioController],
      providers: [
        {
          provide: ComentarioService,
          useValue: serviceMock,
        },
      ],
    }).compile();

    controller = module.get<ComentarioController>(ComentarioController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('debería delegar al servicio', async () => {
      const dto: CreateComentarioDto = {
        descripcion: 'Prueba',
        usuarioId: 1,
        revisionId: 2,
      };

      serviceMock.create!.mockResolvedValue({ id: 1, ...dto });

      const result = await controller.create(dto);

      expect(serviceMock.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual({ id: 1, ...dto });
    });
  });

  describe('findAll', () => {
    it('debería retornar todos los comentarios', async () => {
      serviceMock.findAll!.mockResolvedValue([{ id: 1 }]);

      const result = await controller.findAll();

      expect(serviceMock.findAll).toHaveBeenCalled();
      expect(result).toEqual([{ id: 1 }]);
    });
  });

  describe('findOne', () => {
    it('debería retornar un comentario por ID', async () => {
      serviceMock.findOne!.mockResolvedValue({ id: 1 });

      const result = await controller.findOne('1');

      expect(serviceMock.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual({ id: 1 });
    });
  });

  describe('update', () => {
    it('debería actualizar un comentario', async () => {
      const dto: UpdateComentarioDto = {
        descripcion: 'Actualizado',
        usuarioId: 1,
      };

      serviceMock.update!.mockResolvedValue({
        status: 'OK',
        message: 'comentario actualizado correctamente',
      });

      const result = await controller.update('1', dto);

      expect(serviceMock.update).toHaveBeenCalledWith(1, dto);
      expect(result).toEqual({
        status: 'OK',
        message: 'comentario actualizado correctamente',
      });
    });
  });

  describe('remove', () => {
    it('debería eliminar un comentario usando query param', async () => {
      serviceMock.remove!.mockResolvedValue({
        status: 'OK',
        message: 'comentario eliminado correctamente',
      });

      const result = await controller.remove('5', '10');

      expect(serviceMock.remove).toHaveBeenCalledWith(5, 10);
      expect(result).toEqual({
        status: 'OK',
        message: 'comentario eliminado correctamente',
      });
    });
  });

  describe('findByRequisito', () => {
    it('debería retornar comentarios por externalId', async () => {
      serviceMock.findByRequisitoExternalId!.mockResolvedValue([{ id: 123 }]);

      const result = await controller.findByRequisito('abc-123');

      expect(serviceMock.findByRequisitoExternalId).toHaveBeenCalledWith('abc-123');
      expect(result).toEqual([{ id: 123 }]);
    });
  });
});
