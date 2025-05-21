import { PartialType } from '@nestjs/mapped-types';
import { CreateDetallerequisitoDto } from './create-detallerequisito.dto';

export class UpdateDetallerequisitoDto extends PartialType(CreateDetallerequisitoDto) {}
