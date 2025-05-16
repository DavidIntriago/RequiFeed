import { TipoRol } from "@prisma/client";
import { IsEnum } from "class-validator";
import { ListaTipoRol } from "../enums/rol-type.dto";

export class CreateRolDto {
    @IsEnum( ListaTipoRol, {
        message: "Valid types are: " + ListaTipoRol
    })
    type: TipoRol; 
}