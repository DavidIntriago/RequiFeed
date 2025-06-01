import { Injectable } from '@nestjs/common';
import { CreateRequisitoDto } from './dto/create-requisito.dto';
import { UpdateRequisitoDto } from './dto/update-requisito.dto';
import { PrismaService } from 'src/db/prisma.service';
import { PaginationDto } from 'src/common';

@Injectable()
export class RequisitoService {

  constructor(private prisma: PrismaService) { }

  async create(createRequisitoDto: CreateRequisitoDto) {

    return await this.prisma.requisito.create({
      data: createRequisitoDto,
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

    const totalRequisitos = await this.prisma.requisito.count();
    const requisitos = await this.prisma.requisito.findMany({
        where: {
          proyectoId: id
        }
        // include: {
        //   cuenta: {
        //     include: {
        //       Rol: true,
        //     }
        //   },
        //   grupo: true,
        // },
      });

    if (!totalRequisitos || !requisitos) {
      throw new Error("Proyecto no tiene requisitos");
    }
    return {
      data: {
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
    const {...data } = updateRequisitoDto;
  
    console.log(external_id);
    console.log(data);
  
    const requisito = await this.prisma.requisito.update({
      where: { external_id },
      data: data
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
