import { IsNumber, IsString } from "class-validator";

export class CreateCalificacionDto {
    @IsNumber()
    puntuacion: number;

    @IsString()
    comentario: string;

}
