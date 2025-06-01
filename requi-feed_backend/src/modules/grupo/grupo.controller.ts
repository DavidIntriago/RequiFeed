import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { GrupoService } from './grupo.service';
import { CreateGrupoDto } from './dto/create-grupo.dto';
import { UpdateGrupoDto } from './dto/update-grupo.dto';
import { PaginationDto } from 'src/common';

@Controller('grupo')
export class GrupoController {
  constructor(private readonly grupoService: GrupoService) {}

  @Post("random")
  createRandom(@Body() createGrupoDto: CreateGrupoDto) {
    return this.grupoService.createGroupsbyRamdom(createGrupoDto);
  }

  @Post()
  create(@Body() createGrupoDto: CreateGrupoDto) {
    return this.grupoService.create(createGrupoDto);
  }

  @Get()
  findAll(@Query() paginationDto : PaginationDto) {
    return this.grupoService.findAll(paginationDto);
  }

  @Get("users")
  findAllUsers(@Query() paginationDto : PaginationDto) {
    return this.grupoService.findAllandUsers(paginationDto);
  }

  @Get("users/:id")
  findOneGroup(@Param('id') external_id: string) {
    return this.grupoService.findOneGroup(external_id);
  }

  @Patch('deleteUser/:id')
  deleteUsers(@Param('id') external_id: string, @Body("idUsuario") idUsuario: number ) {
    return this.grupoService.deleteUserFromGroup(external_id, idUsuario );
  }

  @Patch('addUser/:id')
  addUsers(@Param('id') external_id: string, @Body("idUsuario") idUsuario: number ) {
    return this.grupoService.addUserToGroup(external_id, idUsuario );
  }

  @Patch(':id')
  update(@Param('id') external_id: string, @Body() updateGrupoDto: UpdateGrupoDto) {
    return this.grupoService.update(external_id, updateGrupoDto);


}
}
