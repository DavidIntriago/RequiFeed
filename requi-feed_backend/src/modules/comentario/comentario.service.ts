import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { CreateComentarioDto } from './dto/create-comentario.dto';
import { UpdateComentarioDto } from './dto/update-comentario.dto';
import { PrismaService } from 'src/db/prisma.service';
import { Comentario } from './entities/comentario.entity';
import { CreateComentarioDocenteDto } from './dto/create-comentario-docente.dto';

@Injectable()
export class ComentarioService {
  constructor(private prisma: PrismaService) { }

  async create(dto: CreateComentarioDto) {
    const { usuarioId, ...comentarioData } = dto;
    const usuario = await this.prisma.usuario.findUnique({
      where: { id: usuarioId },
      include: {
        grupo: {
          include: {
            proyectos: {
              include: {
                fechaLimite: true,
              },
            },
          },
        },
      },
    });

    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado.');
    }

    if (!usuario.grupo || usuario.grupo.proyectos.length === 0) {
      throw new ForbiddenException('El usuario no pertenece a un grupo con proyectos.');
    }

    const revision = await this.prisma.revision.findUnique({
      where: { id: dto.revisionId },
      include: {
        detalleRequisito: {
          include: {
            requisito: {
              include: {
                proyecto: {
                  include: {
                    fechaLimite: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!revision) {
      throw new NotFoundException('Revisión no encontrada.');
    }

    const requisito = revision.detalleRequisito.requisito;
    if (requisito.estado !== 
'LISTO' && requisito.estado !== 'EN_REVISION'
     ) {
      throw new ForbiddenException('No se puede comentar si el requisito no está en estado LISTO.');
    }

    const hoy = new Date();
    const fechasValidas = requisito.proyecto.fechaLimite.filter(
      (fl) => new Date(fl.fechaLimite).toDateString() === hoy.toDateString()
    );

    if (fechasValidas.length === 0) {
      throw new ForbiddenException('No hay una fecha de revisión activa para hoy.');
    }
    const comentario = this.prisma.comentario.create({
      data: {
        descripcion: comentarioData.descripcion,
        revision: { connect: { id: comentarioData.revisionId } },
        usuario: { connect: { id: usuario.id } },
        comentarioPadre: comentarioData.comentarioPadreId
          ? { connect: { id: comentarioData.comentarioPadreId } }
          : undefined,
      },
      include: {
        revision: {
          include: {
            detalleRequisito: {
              include: {
                requisito:true
              }
            },
          },
        },
        },

    });
    return comentario;

  }

  async createComentarioDocente(createComentarioDocenteDto: CreateComentarioDocenteDto) {
    console.log('dentro de comentario de docente')
    const { usuarioId, ...comentarioData } = createComentarioDocenteDto;
    const usuario = await this.prisma.usuario.findUnique({
      where: { id: usuarioId },
    });

    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado.');
    }
    
    // const detalleRequisito = await this.prisma.revision.create({
    //   data: {
    //     detalleRequisitoId: createComentarioDocenteDto.detalleRequisitoId
    //   }
    // })

    //Crear la revisión si no existe
    const revisionCreated = await this.prisma.revision.create({
      data: {
        detalleRequisito: {
          connect: { id: createComentarioDocenteDto.detalleRequisitoId },
        },
      }
    });

    const revision = await this.prisma.revision.findUnique({
      where: { id: revisionCreated.id },
      include: {
        detalleRequisito: {
          include: {
            requisito: {
              include: {
                proyecto: {
                  include: {
                    fechaLimite: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!revision) {
      throw new NotFoundException('Revisión no encontrada.');
    }

    const requisito = revision.detalleRequisito.requisito;

    if (requisito.estado !== 'ACEPTADO') {
      throw new ForbiddenException('No se puede comentar si el requisito no está en estado ACEPTADO.');
    }

    const reqActualizado = await this.prisma.requisito.update({
      where: { id: requisito.id },
      data: {
        estado: "OBSERVADO"
      }
    })

    // const hoy = new Date();
    // const fechasValidas = requisito.proyecto.fechaLimite.filter(
    //   (fl) => new Date(fl.fechaLimite).toDateString() === hoy.toDateString()
    // );

    // if (fechasValidas.length === 0) {
    //   throw new ForbiddenException('No hay una fecha de revisión activa para hoy.');
    // }



    const comentarioCreado = await this.prisma.comentario.create({
      data: {
        descripcion: comentarioData.descripcion,
        revision: { connect: { id: revision.id } },
        usuario: { connect: { id: usuario.id } },
        comentarioPadre: comentarioData.comentarioPadreId
          ? { connect: { id: comentarioData.comentarioPadreId } }
          : undefined,        
      },
    });

    return {
      data: {
        comentarioCreado,
        requisito: reqActualizado
      }
    }
  }


  async findByRequisitoExternalId(externalId: string) {
    const requisito = await this.prisma.requisito.findUnique({
      where: { external_id: externalId },
      include: {
        detalleRequisito: {
          include: {
            Revision: {
              include: {
                Comentario: {
                  orderBy: { fecha: 'asc' },
                  include: {
                    usuario: {
                      include: {
                        grupo: true,
                        cuenta: {
                          include: {
                            Rol: true,
                          },
                        },
                      },
                    },
                    respuestas: {
                      orderBy: { fecha: 'asc' },
                      include: {
                        usuario: {
                          include: {
                            grupo: true,
                            cuenta: {
                              include: {
                                Rol: true,
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        //estado: true,
      },
    });

    if (!requisito) {
      throw new NotFoundException('Requisito no encontrado');
    }

    const comentarios =
      requisito.detalleRequisito?.flatMap((detalle) =>
        detalle.Revision?.flatMap((rev) => rev.Comentario)
      ) ?? [];

    return comentarios;
  }

  async update(id: number, updateComentarioDto: UpdateComentarioDto) {
    const { descripcion, usuarioId } = updateComentarioDto;
    const comentario = await this.prisma.comentario.findUnique({ where: { id } });
    if (!comentario) {
      throw new NotFoundException('Comentario no encontrado');
    }
    if (comentario.usuarioId !== usuarioId) {
      throw new ForbiddenException('No tienes permiso para editar este comentario');
    }

    await this.prisma.comentario.update({
      where: { id },
      data: {
        descripcion
      },
    });
    return {
      status: 'OK',
      message: 'comentario actualizado correctamente',
    }
  }

  async remove(id: number, userId: number) {

    const comentario = await this.prisma.comentario.findUnique({ where: { id } });
    if (!comentario) {
      throw new NotFoundException('Comentario no encontrado');
    }
    if (comentario.usuarioId !== userId) {
      throw new ForbiddenException('No tienes permiso para eliminar este comentario');
    }

    await this.prisma.comentario.delete({
      where: { id },
    });
    return {
      status: 'OK',
      message: 'comentario eliminado correctamente',
    }
  }

  async findAll() {
    return this.prisma.comentario.findMany();
  }

  async findOne(id: number) {
    return this.prisma.comentario.findUnique({ where: { id } });
  }

}
