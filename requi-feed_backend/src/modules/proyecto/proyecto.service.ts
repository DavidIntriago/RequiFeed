import { Body, Injectable, OnModuleInit, Param } from '@nestjs/common';
import { CreateProyectoDto } from './dto/create-proyecto.dto';
import { UpdateProyectoDto } from './dto/update-proyecto.dto';
import { PrismaClient } from '@prisma/client';
import { PaginationDto } from 'src/common';
import { PrismaService } from 'src/db/prisma.service';

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
          }
        }),
        meta: {
          total: totalPages,
          page: page,
          lastPage: lastPage,
        },
      }; 
  }

  async findOne(external_id: string) {
    const proyecto = await this.prisma.proyecto.findFirst({
      where: { external_id  },
      include: {
        requisitos: true,
        calificacion: true
      }
    });

    if (!proyecto) {
      throw new Error("Proyecto no encontrado");
    }
    return {
      data: proyecto
    };
  }

  async findOneByGroupId(external_id: string) {
    const grupo = await this.prisma.grupo.findFirst({
      where: { external_id  },
      include: {
        proyectos: true
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
      throw new Error('Proyecto no encontrado');
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
}
