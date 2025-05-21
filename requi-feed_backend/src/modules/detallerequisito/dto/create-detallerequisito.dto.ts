import { EstadoRequisito, Prioridad } from "@prisma/client";
import { IsEnum, IsNumber, IsSemVer, IsString } from "class-validator";
import { ListaPrioridadDetalleRequisito } from "../enums/detallerequisito-prioridad.dto";

export class CreateDetallerequisitoDto {
    @IsString()
    nombreRequisito: string;

    @IsEnum( Prioridad, {
        message: "Prioridades válidas: " + ListaPrioridadDetalleRequisito
    })
    prioridad: Prioridad;

    @IsString()
    descripcion: string;

    @IsString()
    version: string;

    @IsNumber()
    requisitoId: number;
}
