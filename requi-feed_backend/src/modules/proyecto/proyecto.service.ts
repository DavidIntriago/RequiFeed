import { Body, Injectable, OnModuleInit, Param } from '@nestjs/common';
import { CreateProyectoDto } from './dto/create-proyecto.dto';
import { UpdateProyectoDto } from './dto/update-proyecto.dto';
import { PrismaClient } from '@prisma/client';
import { PaginationDto } from 'src/common';

@Injectable()
export class ProyectoService extends PrismaClient implements OnModuleInit{
  async onModuleInit() {
        await this.$connect();
  }
  create(createProyectoDto: CreateProyectoDto) {
    return this.proyecto.create({
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
      
      const totalPages = await this.proyecto.count();
      const lastPage = Math.ceil(totalPages / limit);
  
      return {
        data: await this.proyecto.findMany({
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
    const proyecto = await this.proyecto.findFirst({
      where: { external_id  },
      include: {
        requisitos: true
      }
    });

    if (!proyecto) {
      throw new Error("Proyecto no encontrado");
    }
    return {
      data: proyecto
    };
  }

  async update(external_id: string, updateProyectoDto: UpdateProyectoDto) {
      const {...data } = updateProyectoDto;
  
      console.log(external_id);
      console.log(data);
  
      const proyecto = await this.proyecto.update({
        where: { external_id },
        data: data
      });
  
      return {
        data: { proyecto},
      };
    }

  remove(external_id: string) {
    return this.proyecto.delete({
      where: { external_id: external_id }  
    });
  }
}
