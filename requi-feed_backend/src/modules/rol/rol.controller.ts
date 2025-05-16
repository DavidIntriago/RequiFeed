import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { PaginationDto } from 'src/common';
import { RolService } from './rol.service';

@Controller('rol')
export class RolController {
  constructor(private readonly rolService: RolService) {}

  @Get()
  findAll(@Query() paginationDto : PaginationDto) {
    return this.rolService.findAll(paginationDto);
  }
}
