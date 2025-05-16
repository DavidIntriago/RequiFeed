import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { CuentaService } from './cuenta.service';
import { Login } from './dto/login';
import { Registry } from './dto/registry';
import { PaginationDto } from 'src/common';
import { CreateCuentaDto } from './dto/create-cuenta.dto';

@Controller('cuenta')
export class CuentaController {
  constructor(private readonly cuentaService: CuentaService) {}


  @Post('login')
  login(@Body() login: Login) {
    return this.cuentaService.login(login);
  }

  @Post('registry')
  registry(@Body() registry: Registry) {
    return this.cuentaService.registry(registry);
  }

  @Get()
  findAll(@Query() paginationDto : PaginationDto) {
    return this.cuentaService.findAll(paginationDto);
  }

  @Post()
  create(@Body() createCuentaDto: CreateCuentaDto) {
    return this.cuentaService.create(createCuentaDto);
  }
}
