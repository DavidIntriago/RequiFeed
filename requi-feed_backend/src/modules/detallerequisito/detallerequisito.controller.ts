import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DetallerequisitoService } from './detallerequisito.service';
import { CreateDetallerequisitoDto } from './dto/create-detallerequisito.dto';
import { UpdateDetallerequisitoDto } from './dto/update-detallerequisito.dto';

@Controller('detallerequisito')
export class DetallerequisitoController {
  constructor(private readonly detallerequisitoService: DetallerequisitoService) {}

  @Post()
  create(@Body() createDetallerequisitoDto: CreateDetallerequisitoDto) {
    return this.detallerequisitoService.create(createDetallerequisitoDto);
  }

  @Get()
  findAll() {
    return this.detallerequisitoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.detallerequisitoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDetallerequisitoDto: UpdateDetallerequisitoDto) {
    return this.detallerequisitoService.update(+id, updateDetallerequisitoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.detallerequisitoService.remove(+id);
  }
}
