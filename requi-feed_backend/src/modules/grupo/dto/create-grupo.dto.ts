import { Type } from "class-transformer"
import { ArrayMinSize, IsArray, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator"
import { CreateProyectoDto } from "src/modules/proyecto/dto/create-proyecto.dto"
import { CreateUsuarioDto } from "src/modules/usuario/dto/create-usuario.dto"

export class CreateGrupoDto {
    @IsString()
    nombre: string

    @IsString()
    descripcion: string

    @IsNumber()
    idPeriodoAcademico: number
    
    @IsOptional()
    @IsArray()
    @ArrayMinSize(1)
    @ValidateNested({each: true})
    @Type( () => CreateUsuarioDto)
    usuarios: CreateUsuarioDto[]

    @IsOptional()
    @IsArray()
    @ArrayMinSize(1)
    @ValidateNested({each: true})
    @Type( () => CreateProyectoDto)
    proyectos: CreateProyectoDto[]
}
// @IsOptional()