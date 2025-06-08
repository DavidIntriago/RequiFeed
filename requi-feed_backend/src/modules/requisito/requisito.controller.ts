import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { RequisitoService } from './requisito.service';
import { CreateRequisitoDto } from './dto/create-requisito.dto';
import { UpdateRequisitoDto } from './dto/update-requisito.dto';
import { PaginationDto } from 'src/common';

@Controller('requisito')
export class RequisitoController {
  constructor(private readonly requisitoService: RequisitoService) {}

  @Post()
  create(@Body() createRequisitoDto: CreateRequisitoDto) {
    return this.requisitoService.create(createRequisitoDto);
  }

  @Get()
  findAll(@Query() paginationDto : PaginationDto) {
    return this.requisitoService.findAll(paginationDto);
  }
  
  @Get('proyecto/:id')
  findAllByProject(@Param('id') id: string) {
    console.log(id)
    return this.requisitoService.findAllByProject(Number(id));
  }

  @Get(':external_id')
  findOne(@Param('external_id') external_id: string) {
    return this.requisitoService.findOne(external_id);
  }

  @Patch(':external_id')
  updateRequisitoUpdatingDetail(@Param('external_id') external_id: string, @Body() updateRequisitoDto: UpdateRequisitoDto) {
    return this.requisitoService.updateRequisitoUpdatingDetail(external_id, updateRequisitoDto);
  }

  @Patch('createDetail/:external_id')
  updateRequisitoCreationgNewDetail(@Param('external_id') external_id: string, @Body() updateRequisitoDto: UpdateRequisitoDto) {
    return this.requisitoService.updateRequisitoUpdatingDetail(external_id, updateRequisitoDto);
  }

  @Delete(':external_id')
  remove(@Param('external_id') external_id: string) {
    return this.requisitoService.remove(external_id);
  }
}
