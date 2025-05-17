import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { PrismaService } from './db/prisma.service';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UsuarioModule } from './modules/usuario/usuario.module';
import { CuentaModule } from './modules/cuenta/cuenta.module';
import { RolService } from './modules/rol/rol.service';
import { UsuarioService } from './modules/usuario/usuario.service';
import { GrupoModule } from './modules/grupo/grupo.module';
import { ProyectoModule } from './modules/proyecto/proyecto.module';
import { RolModule } from './modules/rol/rol.module';
import { CuentaService } from './modules/cuenta/cuenta.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
      isGlobal: true,
    }),
    UsuarioModule,
    CuentaModule,
    GrupoModule,
    ProyectoModule,
    RolModule
    
  ],
  providers: [{provide: PrismaService,
    useFactory: () => PrismaService.getInstance()
  }, RolService, UsuarioService],
})

export class AppModule {
  constructor(
    private readonly rolService: RolService,
    private readonly cuentaService: CuentaService,
  ) {
    this.rolService.revisionRol();
    this.cuentaService.createAdmin();
  }
}