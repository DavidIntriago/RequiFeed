import { PartialType } from '@nestjs/mapped-types';
import { CreateRequisitoDto } from './create-requisito.dto';

export class UpdateRequisitoDto extends PartialType(CreateRequisitoDto) {}
