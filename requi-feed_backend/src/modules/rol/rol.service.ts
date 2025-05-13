import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/db/prisma.service';
import { TipoRol } from '@prisma/client'; 

@Injectable()
export class RolService {
  constructor(private prisma: PrismaService) {}

  async revisionRol() {
    const rolesPermitidos: TipoRol[] = [
      TipoRol.ANALISTA,
      TipoRol.LIDER,
      TipoRol.DOCENTE,
      TipoRol.OBSERVADOR,
    ];

    for (const rol of rolesPermitidos) {
      const rolExistente = await this.prisma.rol.findFirst({
        where: { tipo: rol },
      });

      if (!rolExistente) {
        await this.prisma.rol.create({
          data: { tipo: rol },
        });

        console.log(`Rol creado: ${rol}`);
      } else {
        console.log(`Rol ya existe: ${rol}`);
      }
    }
  }
}
