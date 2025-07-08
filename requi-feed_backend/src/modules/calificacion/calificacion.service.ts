import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCalificacionDto } from './dto/create-calificacion.dto';
import { UpdateCalificacionDto } from './dto/update-calificacion.dto';
import { PrismaService } from 'src/db/prisma.service';
import { PaginationDto } from 'src/common';

@Injectable()
export class CalificacionService {
  constructor(private prisma: PrismaService) { }
  
  create(createCalificacionDto: CreateCalificacionDto) {
    return this.prisma.calificacion.create({
      data: { 
        puntuacion: createCalificacionDto.puntuacion,
        comentario: createCalificacionDto.comentario,
          Proyecto: {
            connect: { external_id: createCalificacionDto.proyectoId } // Conectar con el proyecto por ID
          }
        }
      });
  }

  async findAll(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;

    const totalPages = await this.prisma.calificacion.count();
    const lastPage = Math.ceil(totalPages / limit);

    return {
      data: await this.prisma.calificacion.findMany({
        skip: (page - 1) * limit,
        take: limit,
      }),
      meta: {
        total: totalPages,
        page: page,
        lastPage: lastPage,
      },
    };
  }

  async findOne(external_id: string) {
    const calificacion = await this.prisma.calificacion.findFirst({
      where: { external_id: external_id },
      include: {
        Proyecto: true,
      },
      
    });
    return {
      data: calificacion,
    };
  }

  async update(external_id: string, updateCalificacionDto: UpdateCalificacionDto) {
    const calificacionUpdated = await this.prisma.calificacion.update({
      where: { external_id: external_id },
      data: updateCalificacionDto,
    });

    return {
      data: calificacionUpdated,
    };
  
  }

  async remove(external_id: string) {
    const projectDeleted = await this.prisma.calificacion.delete({
      where: { external_id: external_id },
    });

    return {
      data: projectDeleted,
    };
  }
}
