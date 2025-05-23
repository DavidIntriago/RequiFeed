import { Injectable, OnModuleInit } from '@nestjs/common';
import { CreateCalificacionDto } from './dto/create-calificacion.dto';
import { UpdateCalificacionDto } from './dto/update-calificacion.dto';
import { PrismaClient } from '@prisma/client';
import { PaginationDto } from 'src/common';

@Injectable()
export class CalificacionService extends PrismaClient implements OnModuleInit{
  async onModuleInit() {
        await this.$connect();
  }

  create(createCalificacionDto: CreateCalificacionDto) {
    return this.calificacion.create({
      data: createCalificacionDto
    });
  }

  async findAll(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;
      
      const totalPages = await this.calificacion.count();
      const lastPage = Math.ceil(totalPages / limit);
  
      return {
        data: await this.calificacion.findMany({
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

  async findOne(id: number) {
    const calificacion = await this.calificacion.findFirst({
      where: { id  },
      include: {
        Proyecto: true
      }
    });

    if (!calificacion) {
      throw new Error("Calificacion no encontrado");
    }
    return {
      data: calificacion
    };
  }

  async update(id: number, updateCalificacionDto: UpdateCalificacionDto) {
  
      console.log(id);
      console.log(updateCalificacionDto);
  
      const proyecto = await this.calificacion.update({
        where: { id },
        data: updateCalificacionDto
      });
  
      return {
        data: { proyecto},
      };
  }

  remove(id: number) {
    return this.calificacion.delete({
      where: { id }  
    });
  }
}
