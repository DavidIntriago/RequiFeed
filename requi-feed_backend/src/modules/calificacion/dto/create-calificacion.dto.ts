import { IsNumber, IsOptional, IsString } from "class-validator";

export class CreateCalificacionDto {
    @IsNumber()
    puntuacion: number;

    @IsOptional()
    @IsString()
    comentario: string;

    @IsString()
    proyectoId: string;
}
