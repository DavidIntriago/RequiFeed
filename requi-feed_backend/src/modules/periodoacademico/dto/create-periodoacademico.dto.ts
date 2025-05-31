import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsString, Length, Matches } from 'class-validator';

export class periodoAcademicoDto {
  @IsString()
  @Length(3, 50, { message: 'El nombre debe tener entre 3 y 50 caracteres' })
  @Matches(/^[a-zA-Z0-9\sáéíóúÁÉÍÓÚñÑ.,-]*$/, {
    message: 'El nombre contiene caracteres inválidos',
  })
  nombre: string;

    @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  fechaInicio: Date;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  fechaFin: Date;

    @IsString()
    modalidad: string;

}
