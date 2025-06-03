import { Prioridad } from "@prisma/client";
import { IsEnum, IsNumber, IsString } from "class-validator";
import { ListaTipoRequisito } from "../enums/requisito-tipo.dto";
import { ListaEstadoRequisito } from "../enums/requisito-estado.dto";
import { ListaPrioridadRequisito } from "../enums/requisito-prioridad.dto";

export class CreateDetalleRequisitoDto {
    @IsString()
    nombreRequisito: string;

    @IsEnum( Prioridad, {
        message: "Tipos validos: " + ListaPrioridadRequisito
    })
    prioridad: Prioridad;

    @IsString()
    descripcion: string;

    @IsString()
    version: string;

    

}
