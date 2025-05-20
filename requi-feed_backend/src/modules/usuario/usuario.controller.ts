import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { PaginationDto } from 'src/common';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';

@Controller('usuario')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @Post()
  create(@Body() createUsuarioDto: CreateUsuarioDto) {
    return this.usuarioService.create(createUsuarioDto);
  }

  @Get()
  findAll(@Query() paginationDto : PaginationDto) {
    return this.usuarioService.findAll(paginationDto);
  }

  @Patch(':id')
  update(@Param('id') id:string,
    @Body() updateUsuarioDto: UpdateUsuarioDto) {  
      return this.usuarioService.update(Number(id), updateUsuarioDto);
  }
  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.usuarioService.findOne(id);
  // }



  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usuarioService.remove(+id);
  }
}
