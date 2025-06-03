import { EstadoRequisito, TipoRequisito } from "@prisma/client";
import { ArrayMinSize, IsArray, IsEnum, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";
import { ListaEstadoProyecto } from "src/modules/proyecto/enums/proyecto-estado.dto";
import { ListaTipoRequisito } from "../enums/requisito-tipo.dto";
import { ListaEstadoRequisito } from "../enums/requisito-estado.dto";
import { Type } from "class-transformer";
import { CreateDetalleRequisitoDto } from "./create-detalleRequisito.dto";

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

    @IsOptional()
    @IsArray()
    @ArrayMinSize(1)
    @ValidateNested({each: true})
    @Type( () => CreateDetalleRequisitoDto)
    detalleRequisito: CreateDetalleRequisitoDto[]

}
