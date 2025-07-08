import { Controller, Get, Post, Body, Patch, Param, Delete, Query} from '@nestjs/common';
import { ComentarioService } from './comentario.service';
import { CreateComentarioDto } from './dto/create-comentario.dto';
import { UpdateComentarioDto } from './dto/update-comentario.dto';
import { CreateComentarioDocenteDto } from './dto/create-comentario-docente.dto';

@Controller('comentario')
export class ComentarioController {
  constructor(private readonly comentarioService: ComentarioService) { }

  @Post()
  create(@Body() dto: CreateComentarioDto) {
    
    return this.comentarioService.create(dto);
  }

  @Post('docente')
  createComentarioDocente(@Body() createComentarioDocenteDto: CreateComentarioDocenteDto) {
    return this.comentarioService.createComentarioDocente(createComentarioDocenteDto);
  }

  @Get()
  findAll() {
    return this.comentarioService.findAll();
  }

  @Get('requisito/:external_id')
  findByRequisito(@Param('external_id') externalId: string) {
    return this.comentarioService.findByRequisitoExternalId(externalId);
  }


  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.comentarioService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateComentarioDto: UpdateComentarioDto,
  ) {
    return this.comentarioService.update(+id, updateComentarioDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Query('userId') userId: string) {
    return this.comentarioService.remove(+id, +userId);
  }
}
