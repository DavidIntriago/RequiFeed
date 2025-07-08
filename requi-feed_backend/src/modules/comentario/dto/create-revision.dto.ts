import{ IsNumber } from "class-validator";

export class CreateComentarioDto {
  @IsNumber()
  detalleRequisitoId: number;
}