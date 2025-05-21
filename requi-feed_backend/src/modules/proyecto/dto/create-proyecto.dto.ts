import { EstadoProyecto } from "@prisma/client";
import { IsEnum, IsNumber, IsString } from "class-validator";
import { ListaEstadoProyecto } from "../enums/proyecto-estado.dto";

export class CreateProyectoDto {
    @IsString()
    nombre: string;

    @IsString()
    descripcion: string;

    @IsEnum( EstadoProyecto, {
        message: "Valid types are: " + ListaEstadoProyecto
    })
    estado: EstadoProyecto;

    @IsNumber()
    grupoId: number;



}
