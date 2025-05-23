import { PartialType } from '@nestjs/mapped-types';
import { CreateCalificacionDto } from './create-calificacion.dto';

export class UpdateCalificacionDto extends PartialType(CreateCalificacionDto) {}
