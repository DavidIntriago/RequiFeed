import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ProyectoService } from './proyecto.service';
import { CreateProyectoDto } from './dto/create-proyecto.dto';
import { UpdateProyectoDto } from './dto/update-proyecto.dto';
import { PaginationDto } from 'src/common';
import { CreateReviewDto } from './dto/date-review';

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

  @Get('revisar/:grupoId')
  findAllOtherGroups(@Param('grupoId') grupoId: number) {
    return this.proyectoService.findAllOtherGroups(grupoId);
  }

  @Get(':external_id')
  findOne(@Param('external_id') external_id: string) {
    return this.proyectoService.findOne(external_id);
  }

  @Get('grupo/:id')
  findOneByGroupId(@Param('id') id: number) {
    return this.proyectoService.findOneByGroupId(id);
  }

  @Get('status/active')
  findAllActiveProjects() {
    console.log('Fetching all active projects');
    return this.proyectoService.findAllByActive();
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

  @Post(':external_id/revision')
  createReview(@Param('external_id') external_id: string, @Body() createReviewDto: CreateReviewDto) {
    return this.proyectoService.createDateRevision(external_id, createReviewDto);
  }

  @Patch(':external_id/revision/update')
  updateReview(@Param('external_id') external_id: string, @Body() createReviewDto: CreateReviewDto) {
    return this.proyectoService.updateDateRevision(external_id, createReviewDto);
  }

  @Post('revision')
  createRevision(@Body() createReviewDto: CreateReviewDto) {
    return this.proyectoService.createDateRevisionMasiva(createReviewDto);
  }
}
