import { validate } from 'class-validator';
import { CreateComentarioDto } from './dto/create-comentario.dto';
import { UpdateComentarioDto } from './dto/update-comentario.dto';

describe('CreateComentarioDto', () => {
  it('debería validar un DTO correcto', async () => {
    const dto = new CreateComentarioDto();
    dto.descripcion = 'Comentario de prueba';
    dto.usuarioId = 1;
    dto.revisionId = 2;

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('debería fallar si falta un campo obligatorio', async () => {
    const dto = new CreateComentarioDto();
    dto.usuarioId = 1;
    // Falta `descripcion` y `revisionId`

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    const props = errors.map((e) => e.property);
    expect(props).toContain('descripcion');
    expect(props).toContain('revisionId');
  });

  it('debería permitir comentarioPadreId como opcional', async () => {
    const dto = new CreateComentarioDto();
    dto.descripcion = 'Comentario raíz';
    dto.usuarioId = 1;
    dto.revisionId = 2;

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('debería fallar si comentarioPadreId no es un número', async () => {
    const dto = new CreateComentarioDto();
    dto.descripcion = 'Comentario';
    dto.usuarioId = 1;
    dto.revisionId = 2;
    // @ts-ignore: intencionalmente mal
    dto.comentarioPadreId = 'no-es-numero';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('comentarioPadreId');
  });

  describe('UpdateComentarioDto', () => {
    it('debería validar un DTO correcto', async () => {
      const dto = new UpdateComentarioDto();
      dto.descripcion = 'Comentario actualizado';
      dto.usuarioId = 5;

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('debería fallar si falta la descripción', async () => {
      const dto = new UpdateComentarioDto();
      dto.usuarioId = 5;

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('descripcion');
    });

    it('debería fallar si usuarioId no es número', async () => {
      const dto = new UpdateComentarioDto();
      dto.descripcion = 'Texto válido';
      // @ts-ignore: intencionalmente mal
      dto.usuarioId = 'string';

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('usuarioId');
    });
  });
});