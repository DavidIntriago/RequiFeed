
import { IsOptional, IsString, IsNumber } from "class-validator";

export class UpdateGrupoDto {
  @IsOptional()
  @IsString()
  nombre?: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsNumber()
  idPeriodoAcademico?: number;

  @IsOptional()
  @IsNumber()
  cantidadGrupos?: number;
}

