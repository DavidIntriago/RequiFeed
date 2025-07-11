import { Body, Injectable, NotFoundException, OnModuleInit, Param } from '@nestjs/common';
import { CreateProyectoDto } from './dto/create-proyecto.dto';
import { UpdateProyectoDto } from './dto/update-proyecto.dto';
import { PaginationDto } from 'src/common';
import { PrismaService } from 'src/db/prisma.service';
import { CreateReviewDto } from './dto/date-review';

@Injectable()
export class ProyectoService{
  constructor(private prisma: PrismaService) { }
  
  create(createProyectoDto: CreateProyectoDto) {
    return this.prisma.proyecto.create({
      data: {
        nombre: createProyectoDto.nombre,
        descripcion: createProyectoDto.descripcion,
        estado: createProyectoDto.estado,
        grupo: {
          connect: { id: createProyectoDto.grupoId } // <--- así conectas por ID
        }
      }
    });
  }

  async findAll(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;
      
      const totalPages = await this.prisma.proyecto.count();
      const lastPage = Math.ceil(totalPages / limit);
  
      return {
        data: await this.prisma.proyecto.findMany({
          skip: (page - 1) * limit,
          take: limit,
          include: {
            grupo: {
              include: {
                usuarios: true,
            }
          },
          fechaLimite: true,
          }
        }),
        meta: {
          total: totalPages,
          page: page,
          lastPage: lastPage,
        },
      }; 
  }

  async findAllOtherGroups( grupoId: number) {      
      const totalPages = await this.prisma.proyecto.count({
        where: {
          grupoId: {
            not: grupoId, // Excluye el grupo actual
          }
        }
      });
  
      return {
        data: await this.prisma.proyecto.findMany({
          where: {
            grupoId: {
              not: grupoId, // Excluye el grupo actual
            }
          },
          include: {
            grupo: {
              include: {
                usuarios: true,
            }
            },
            fechaLimite: true,
          }
        }),
        meta: {
          total: totalPages
        },
      }; 
  }

  async findOne(external_id: string) {
    const proyecto = await this.prisma.proyecto.findFirst({
      where: { external_id  },
      include: {
        requisitos: true,
        calificacion: true,
        fechaLimite: true,
      }
    });

    if (!proyecto) {
      throw new Error("Proyecto no encontrado");
    }
    return {
      data: proyecto
    };
  }

  async findOneByGroupId(id: number) {
    const grupo = await this.prisma.grupo.findFirst({
      where: { id  },
      include: {
        proyectos: {
          include: {
            requisitos: true,
            fechaLimite: true,
            calificacion: true,
            grupo: true,
          }}
      }
    });

    if (!grupo) {
      throw new Error("Grupo no encontrado");
    }
    return {
      data: grupo.proyectos
    };
  }

  async update(external_id: string, updateProyectoDto: UpdateProyectoDto) {
      const {...data } = updateProyectoDto;
  
      console.log(external_id);
      console.log(data);
  
      const proyecto = await this.prisma.proyecto.update({
        where: { external_id },
        data: data
      });
  
      return {
        data: { proyecto},
      };
    }

  async remove(external_id: string) {
    // Busca el proyecto primero
    const proyecto = await this.prisma.proyecto.findUnique({
      where: { external_id },
      include: { requisitos: 
        {
          include: {
            detalleRequisito: true
          }
        }
       },
    });
    if (!proyecto) {
      throw new NotFoundException('Proyecto no encontrado');
    }

    if (proyecto.estado == 'FINALIZADO') {
      throw new NotFoundException(`'Proyecto con estado FINALIZADO no puede ser eliminado`);
    }
    // Elimina todos los requisitos asociados
    await Promise.all(
      proyecto.requisitos.flatMap((r) =>
        r.detalleRequisito.map((detalleRequisito) =>
          this.prisma.detalleRequisito.delete({ where: { id: detalleRequisito.id } })
        )
      )
    );

    await Promise.all(
      proyecto.requisitos.map((r) =>
        this.prisma.requisito.delete({ where: { id: r.id } })
      )
    );

    // Luego elimina el proyecto
    return this.prisma.proyecto.delete({
      where: { external_id },
    });
  }

  async findAllByActive() {
    const proyectos = await this.prisma.proyecto.findMany({
      where: { estado: 'ACTIVO' },
      include: {
        grupo: {
          include: {
            usuarios: true,
          }
        },
        fechaLimite: true,
        requisitos: true
      }
    });

    if (!proyectos || proyectos.length === 0) {
      throw new NotFoundException('No hay proyectos activos');
    }

    return {
      data: proyectos
    };
  }
  
  async createDateRevision(external_id: string, dataReview: CreateReviewDto ) {
    const proyecto = await this.prisma.proyecto.findUnique({
      where: { external_id },
    });

    if (!proyecto) {
      throw new Error('Proyecto no encontrado');
    }

    dataReview.proyectoId= proyecto.id;

    const fechaLimiteExistente = await this.prisma.fechaLimite.findFirst({
      where: {
        proyectoId: proyecto.id,
        tipo: dataReview.tipoRevision
      }
    });
    if (fechaLimiteExistente) {
      throw new Error(`Ya existe una fecha límite de tipo ${dataReview.tipoRevision} para este proyecto.`);
    }

    const fechaLimite = await this.prisma.fechaLimite.create({
      data: {
        fechaLimite: dataReview.fechaLimite,
        tipo: dataReview.tipoRevision,
        proyecto: {
          connect: { id: dataReview.proyectoId } 
        }
      }
    });

    return {
      data: fechaLimite
    };
  }

  async updateDateRevision(external_id: string, dataReview: CreateReviewDto) {
    const proyecto = await this.prisma.proyecto.findUnique({
      where: { external_id },
      include: { fechaLimite: true }
    });
    if (!proyecto) {
      throw new Error('Proyecto no encontrado');
    }

    if(dataReview.tipoRevision === 'EXTERNA'){
      const fechaLimiteExistente = proyecto.fechaLimite.find(f => f.tipo === 'EXTERNA');
      if (!fechaLimiteExistente) {
        throw new Error(`No existe una fecha límite de tipo ${dataReview.tipoRevision} para este proyecto.`);
      }

      if (fechaLimiteExistente) {
        return this.prisma.fechaLimite.update({
          where: { id: fechaLimiteExistente.id },
          data: {
            fechaLimite: dataReview.fechaLimite,
          }
        });
      }
    }else if(dataReview.tipoRevision === 'INTERNA'){
      const fechaLimiteExistente = proyecto.fechaLimite.find(f => f.tipo === 'INTERNA');
      if (!fechaLimiteExistente) {
        throw new Error(`No existe una fecha límite de tipo ${dataReview.tipoRevision} para este proyecto.`);
      }

      if (fechaLimiteExistente) {
        return this.prisma.fechaLimite.update({
          where: { id: fechaLimiteExistente.id },
          data: {
            fechaLimite: dataReview.fechaLimite,
          }
        });
      }
    }

  }

  async createDateRevisionMasiva(dataReview: CreateReviewDto) {
    const proyectos = await this.prisma.proyecto.findMany({
      include: { fechaLimite: true }
    });
    if (!proyectos || proyectos.length === 0) {
      throw new Error('No hay proyectos disponibles para asignar fechas.');
    }
    const resultados = await Promise.all(proyectos.map(async (proyecto) => {
      const fechaLimiteExistente = proyecto.fechaLimite.find(f => f.tipo === dataReview.tipoRevision);
      if (fechaLimiteExistente) {
        return this.prisma.fechaLimite.update({
          where: { id: fechaLimiteExistente.id },
          data: {
            fechaLimite: dataReview.fechaLimite,
          }
        });
      } else {
        return this.prisma.fechaLimite.create({
          data: {
            fechaLimite: dataReview.fechaLimite,
            tipo: dataReview.tipoRevision,
            proyecto: {
              connect: { id: proyecto.id }
            }
          }
        });
      }
    }));

    return {
      data: resultados
    };


}
    

}

