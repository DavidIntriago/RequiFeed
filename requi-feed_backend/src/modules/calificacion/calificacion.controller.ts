import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CalificacionService } from './calificacion.service';
import { CreateCalificacionDto } from './dto/create-calificacion.dto';
import { UpdateCalificacionDto } from './dto/update-calificacion.dto';
import { PaginationDto } from 'src/common';

@Controller('calificacion')
export class CalificacionController {
  constructor(private readonly calificacionService: CalificacionService) {}

  @Post()
  create(@Body() createCalificacionDto: CreateCalificacionDto) {
    return this.calificacionService.create(createCalificacionDto);
  }

  @Get()
  findAll(paginationDto: PaginationDto) {
    return this.calificacionService.findAll(paginationDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.calificacionService.findOne(id);
  }

  @Patch(':external_id')
  update(@Param('external_id') external_id: string, @Body() updateCalificacionDto: UpdateCalificacionDto) {
    return this.calificacionService.update(external_id, updateCalificacionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.calificacionService.remove(id);
  }
}
