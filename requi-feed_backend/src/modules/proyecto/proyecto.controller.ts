import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ProyectoService } from './proyecto.service';
import { CreateProyectoDto } from './dto/create-proyecto.dto';
import { UpdateProyectoDto } from './dto/update-proyecto.dto';
import { PaginationDto } from 'src/common';

@Controller('proyecto')
export class ProyectoController {
  constructor(private readonly proyectoService: ProyectoService) {}

  @Post()
  create(@Body() createProyectoDto: CreateProyectoDto) {
    return this.proyectoService.create(createProyectoDto);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.proyectoService.findAll(paginationDto);
  }

  @Get(':external_id')
  findOne(@Param('external_id') external_id: string) {
    return this.proyectoService.findOne(external_id);
  }

  @Get('grupo/:external_id')
  findOneByGroupId(@Param('external_id') external_id: string) {
    return this.proyectoService.findOneByGroupId(external_id);
  }

  @Patch(':external_id')
  update(@Param('external_id') external_id: string, 
  @Body() updateProyectoDto: UpdateProyectoDto) {
    return this.proyectoService.update(external_id, updateProyectoDto);
  }

  @Delete(':external_id')
  remove(@Param('external_id') external_id: string) {
    return this.proyectoService.remove(external_id);
  }
}
