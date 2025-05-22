import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PeriodoacademicoService } from './periodoacademico.service';
import { periodoAcademicoDto } from './dto/create-periodoacademico.dto';

@Controller('periodoacademico')
export class PeriodoacademicoController {
  constructor(private readonly periodoacademicoService: PeriodoacademicoService) {}

  @Post()
  create(@Body() createPeriodoacademicoDto: periodoAcademicoDto) {
    return this.periodoacademicoService.createPeriodoAcademico(createPeriodoacademicoDto);
  }


}
