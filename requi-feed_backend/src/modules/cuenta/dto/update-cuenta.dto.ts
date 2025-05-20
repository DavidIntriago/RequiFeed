import { IsNumber, IsString } from "class-validator";
import { CreateCuentaDto } from "./create-cuenta.dto";
import { PartialType } from "@nestjs/mapped-types";

export class UpdateCuentaDto extends PartialType(CreateCuentaDto) {
    @IsString()
    id: string;
}