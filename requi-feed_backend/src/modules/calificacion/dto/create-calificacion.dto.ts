import { IsNumber, IsOptional, IsString } from "class-validator";

export class CreateCalificacionDto {
    @IsNumber()
    puntuacion: number;

    @IsNumber()
    notaMaxima: number;

    @IsOptional()
    @IsString()
    comentario: string;

    @IsString()
    proyectoId: string;


}
