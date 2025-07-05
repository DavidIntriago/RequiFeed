import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateComentarioDto {
  @IsString()
  @IsNotEmpty()
  descripcion: string;

  @IsNumber()
  usuarioId: number;
  
}