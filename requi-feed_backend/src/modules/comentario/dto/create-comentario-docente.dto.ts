import{ IsBoolean, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateComentarioDocenteDto {
  //Detalle de requisito
  @IsNumber()
  detalleRequisitoId: number;
  
  @IsString()
  descripcion: string;
  
  @IsNumber()
  usuarioId: number;

  @IsOptional()
  @IsNumber()
  comentarioPadreId?: number;
  
  @IsOptional()
  @IsBoolean()
  updateState: boolean;
}