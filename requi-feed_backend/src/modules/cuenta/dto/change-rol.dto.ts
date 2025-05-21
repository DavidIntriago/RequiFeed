import { TipoRol } from "@prisma/client";
import { IsEnum, IsString } from "class-validator";
import { ListaTipoRol } from "src/modules/rol/enums/rol-type.dto";

export class ChangeRolDto {

    @IsEnum( ListaTipoRol, {
        message: "Valid types are: " + ListaTipoRol
    })
    rolType: TipoRol; 
    
}