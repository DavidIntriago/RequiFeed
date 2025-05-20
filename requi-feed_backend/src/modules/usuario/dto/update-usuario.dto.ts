import { PartialType } from "@nestjs/mapped-types";
import { IsString } from "class-validator";
import { CreateUsuarioDto } from "./create-usuario.dto";

export class UpdateUsuarioDto extends PartialType(CreateUsuarioDto) {
  @IsString()
  id: string;
}