import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RequisitoService } from './requisito.service';
import { CreateRequisitoDto } from './dto/create-requisito.dto';
import { UpdateRequisitoDto } from './dto/update-requisito.dto';

@Controller('requisito')
export class RequisitoController {
  constructor(private readonly requisitoService: RequisitoService) {}

  @Post()
  create(@Body() createRequisitoDto: CreateRequisitoDto) {
    return this.requisitoService.create(createRequisitoDto);
  }

  @Get()
  findAll() {
    return this.requisitoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.requisitoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRequisitoDto: UpdateRequisitoDto) {
    return this.requisitoService.update(+id, updateRequisitoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.requisitoService.remove(+id);
  }
}
