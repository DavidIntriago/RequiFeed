import { EstadoProyecto, TipoRevision } from "@prisma/client";
import { Type } from "class-transformer";
import { IsDate, IsEnum, IsNumber, IsString } from "class-validator";

export class CreateReviewDto {

    @IsDate()
    @Type(() => Date)
    fechaLimite: Date;

    @IsEnum(TipoRevision)
    tipoRevision: TipoRevision;


    @IsNumber()
    proyectoId: number;



}
