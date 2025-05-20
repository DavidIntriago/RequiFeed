import { Usuario} from "@prisma/client";
import { IsNumber, IsOptional, IsString } from "class-validator";

export class CreateUsuarioDto {

    @IsString()
    @IsOptional()
    nombre: string

    @IsString()
    @IsOptional()
    apellido: string
    
    @IsString()
    @IsOptional()
    ocupacion: string

    @IsString()
    @IsOptional()
    area: string

    @IsString()
    @IsOptional()
    foto: string


    //Relaciones
    @IsNumber()
    @IsOptional()
    grupoId: number;

    @IsNumber()
    @IsOptional()
    cuentaId: number;


    

}   




