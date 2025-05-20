import { IsOptional, IsString } from "class-validator";

export class UpdateCuentaDto  {
    @IsString()
    @IsOptional()
    id: string;

    @IsString()
    @IsOptional()
    nombre: string;

    @IsString()
    @IsOptional()
    apellido: string;

    @IsString()
    @IsOptional()
    email: string;

    @IsString()
    @IsOptional()
    ocupacion: string;

    @IsString()
    @IsOptional()
    area: string;

    @IsString()
    @IsOptional()
    foto: string;

    @IsString()
    @IsOptional()
    estado: string;
}