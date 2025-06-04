import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRequisitoDto } from './dto/create-requisito.dto';
import { UpdateRequisitoDto } from './dto/update-requisito.dto';
import { PrismaService } from 'src/db/prisma.service';
import { PaginationDto } from 'src/common';

@Injectable()
export class RequisitoService {

  constructor(private prisma: PrismaService) { }

  async create(createRequisitoDto: CreateRequisitoDto) {

    return await this.prisma.requisito.create({
      data: {
        numeroRequisito: createRequisitoDto.numeroRequisito,
        tipo: createRequisitoDto.tipo,
        estado: createRequisitoDto.estado,
        proyecto: {
          connect: { id: createRequisitoDto.proyectoId }, 
        },
        detalleRequisito: {
          create: createRequisitoDto.detalleRequisito,
        },
      },
    })
  }

  async findAll(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;

    const totalPages = await this.prisma.requisito.count();
    const lastPage = Math.ceil(totalPages / limit);

    return {
      data: await this.prisma.requisito.findMany({
        skip: (page - 1) * limit,
        take: limit,
        // include: {
        //   cuenta: {
        //     include: {
        //       Rol: true,
        //     }
        //   },
        //   grupo: true,
        // },
      }),

      meta: {
        total: totalPages,
        page: page,
        lastPage: lastPage,
      },
    };
  }

  async findAllByProject(id: number) {

    const proyecto = await this.prisma.proyecto.findFirst({
      where:{
        id: id
      }
    });
    if (!proyecto) {
      throw new NotFoundException(`Proyecto con ID ${id} no existe`);
    }

    const totalRequisitos = await this.prisma.requisito.count({
      where: {
        proyectoId: id
      },
    });
    
    const requisitos = await this.prisma.requisito.findMany({
        where: {
          proyectoId: id
        },
        include: {
          detalleRequisito: true,
        }
    });


    // if (!requisitos || requisitos.length == 0) {
    //   throw new NotFoundException(`El proyecto no tiene requisitos`);
    // }

    return {
      data: {
        statusCode: 200,
        proyecto,
        requisitos,
        totalRequisitos
      } 
    };
  }

  async findOne(external_id: string) {
    const requisito = await this.prisma.requisito.findFirst({
      where: { external_id  },
      include: {
        detalleRequisito: true
      }
    });

    if (!requisito) {
      throw new Error("Requisito no encontrado");
    }
    return {
      data: requisito
    };
  }

  async update(external_id: string, updateRequisitoDto: UpdateRequisitoDto) {
    // const {...data } = updateRequisitoDto;
  
    // console.log(external_id);
    // console.log(data);
  
    const requisito = await this.prisma.requisito.update({
      where: { external_id },
      data: {
        numeroRequisito: updateRequisitoDto.numeroRequisito,
        tipo: updateRequisitoDto.tipo,
        estado: updateRequisitoDto.estado,
        proyecto: {
          connect: { id: updateRequisitoDto.proyectoId }, 
        },
        detalleRequisito: {
          create: updateRequisitoDto.detalleRequisito,
        },
      },
    });
  
    return {
      data: { proyecto: requisito},
    };
  }

  remove(external_id: string) {
    return this.prisma.requisito.delete({
      where: { external_id: external_id }  
    });
  }
}
