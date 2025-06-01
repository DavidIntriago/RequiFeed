import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseInterceptors, UploadedFile } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { PaginationDto } from 'src/common';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

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

  @Get("rol")
  findAllAnalistAndLider() {
    return this.usuarioService.findUsersByRol();
  }

  @Get('igrupo')
  findAllIGrupo() {
    return this.usuarioService.findUsersByGrupoNull();
  }

  @Patch(':id')
  update(@Param('id') id:string,
    @Body() updateUsuarioDto: UpdateUsuarioDto) {  
      return this.usuarioService.update(Number(id), updateUsuarioDto);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads', // Carpeta donde se guardan los archivos
      filename: (req, file, cb) => {
        // Extraer extensión original (ej. .jpg, .png)
        const fileExt = extname(file.originalname);
        
        // Crear un nombre único (puedes usar un timestamp o UUID)
        const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${fileExt}`;

        cb(null, fileName);
      },
    }),
  }))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    console.log(file);

    return {
      data: {
        message: 'Archivo subido satisfactoriamente',
        filename: file.filename,
        // path: `http://localhost:4000/subidas/${file.filename}`
      }
      
    };
  }



  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usuarioService.remove(+id);
  }
}
