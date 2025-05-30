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
import { AuthModule } from './modules/auth/auth.module';
import { MailService } from './modules/mail/mail.service';
import { RequisitoModule } from './modules/requisito/requisito.module';
import { DetallerequisitoModule } from './modules/detallerequisito/detallerequisito.module';
import { PeriodoacademicoModule } from './modules/periodoacademico/periodoacademico.module';
import { CalificacionModule } from './modules/calificacion/calificacion.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { MulterModule } from '@nestjs/platform-express';
@Module({
  imports: [
    // MulterModule.register({
    //   dest: './uploads',
    // }),
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot: '/subidas',
      serveStaticOptions: {
        index: false,
      },
    }),
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
      isGlobal: true,
    }),
    UsuarioModule,
    CuentaModule,
    GrupoModule,
    ProyectoModule,
    RolModule,
    AuthModule,
    RequisitoModule,
    DetallerequisitoModule,
    PeriodoacademicoModule,
    CalificacionModule
    
  ],
  providers: [{provide: PrismaService,
    useFactory: () => PrismaService.getInstance()
  }, RolService, UsuarioService, MailService],
})

export class AppModule {
  constructor(
    private readonly rolService: RolService,
    private readonly cuentaService: CuentaService,
  ) {

    this.rolService.revisionRol().then(() => {
    this.cuentaService.createAdmin();
    });
  }
}