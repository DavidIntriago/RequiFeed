import { IsNumber, IsString } from "class-validator";

export class CreateCuentaDto {
    @IsString()
    email: string;

    @IsString()
    contrasenia: string;

    @IsString()
    estado: string;

    @IsNumber()
    rolId: number;

}