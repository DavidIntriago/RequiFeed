import { IsNotEmpty, IsString } from "class-validator";

export class ChangePasswordDto {

    @IsString()
    email: string;

    @IsString()
    contraseniaActual: string;
    
    @IsString()
    contrasenia: string;

    @IsString()
    contraseniaConfirm: string;
}