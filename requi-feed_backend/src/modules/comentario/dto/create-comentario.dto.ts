import{ IsNumber, IsOptional, IsString } from "class-validator";

export class CreateComentarioDto {
  @IsString()
  descripcion: string;
  
  @IsNumber()
  usuarioId: number;

  @IsNumber()
  revisionId: number;

  @IsOptional()
  @IsNumber()
  comentarioPadreId?: number;
}