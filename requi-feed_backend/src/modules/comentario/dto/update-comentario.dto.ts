import { PartialType } from '@nestjs/mapped-types';
import { CreateComentarioDto } from './create-comentario.dto';
import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateComentarioDto extends PartialType(CreateComentarioDto) {
  @IsString()
  @IsNotEmpty()
  descripcion: string;

  @IsNumber()
  usuarioId: number;
  
}