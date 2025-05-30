import { PartialType } from '@nestjs/mapped-types';
import { CreateGrupoDto } from './create-grupo.dto';
import { IsString } from 'class-validator';

export class UpdateGrupoDto extends PartialType(CreateGrupoDto) {
      @IsString()
      id: string;
}
