import { EstadoRequisito, TipoRequisito } from "@prisma/client";
import { IsEnum, IsNumber, IsString } from "class-validator";
import { ListaEstadoProyecto } from "src/modules/proyecto/enums/proyecto-estado.dto";
import { ListaTipoRequisito } from "../enums/requisito-tipo.dto";
import { ListaEstadoRequisito } from "../enums/requisito-estado.dto";

export class CreateRequisitoDto {
    @IsString()
    numeroRequisito: string;

    @IsEnum( TipoRequisito, {
        message: "Tipos validos: " + ListaTipoRequisito
    })
    tipo: TipoRequisito;

    @IsEnum( EstadoRequisito, {
        message: "Estados validos: " + ListaEstadoRequisito
    })
    estado: EstadoRequisito;

    @IsNumber()
    proyectoId: number;

}
