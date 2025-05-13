import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CuentaService } from './cuenta.service';
import { Login } from './dto/login';
import { Registry } from './dto/registry';

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
}
