import { TipoRol } from "@prisma/client";
import { IsEnum, IsString } from "class-validator";
import { ListaTipoRol } from "src/modules/rol/enums/rol-type.dto";

export class ChangeRolDto {

    @IsEnum( ListaTipoRol, {
        message: "Los tipos validos son: " + ListaTipoRol
    })
    rolType: TipoRol; 
    
}