import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRequisitoDto } from './dto/create-requisito.dto';
import { UpdateRequisitoDto } from './dto/update-requisito.dto';
import { PrismaService } from 'src/db/prisma.service';
import { PaginationDto } from 'src/common';

@Injectable()
export class RequisitoService {

  constructor(private prisma: PrismaService) { }

  async create(createRequisitoDto: CreateRequisitoDto) {
    const ultimoRequisito = await this.prisma.requisito.findFirst({
      where: {
        proyectoId: createRequisitoDto.proyectoId, // opcional si es por proyecto
      },
      orderBy: {
        numeroRequisito: 'desc',
      },
    });

    let siguienteNumero = 1;

    if (ultimoRequisito?.numeroRequisito) {
      const numeroActual = parseInt(ultimoRequisito.numeroRequisito);
      siguienteNumero = isNaN(numeroActual) ? 1 : numeroActual + 1;
    }

    return await this.prisma.requisito.create({
      data: {
        numeroRequisito: siguienteNumero.toString(),
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
        orderBy: {
          numeroRequisito: 'desc',
        },
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
      where: {
        id: id,
      },
    });

    if (!proyecto) {
      throw new NotFoundException(`Proyecto con ID ${id} no existe`);
    }

    const totalRequisitos = await this.prisma.requisito.count({
      where: {
        proyectoId: id,
      },
    });

    const requisitos = await this.prisma.requisito.findMany({
      where: {
        proyectoId: id,
      },
      include: {
        detalleRequisito: true,
      },
      orderBy: {
        numeroRequisito: 'asc', // <--- orden ascendente
      },
    });

    return {
      data: {
        statusCode: 200,
        proyecto,
        requisitos,
        totalRequisitos,
      },
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

  async updateRequisitoCreationgNewDetail(external_id: string, updateRequisitoDto: UpdateRequisitoDto) {
    const requisito = await this.prisma.requisito.update({
      where: { external_id },
      data: {
        // numeroRequisito: updateRequisitoDto.numeroRequisito,
        tipo: updateRequisitoDto.tipo,
        estado: updateRequisitoDto.estado,
        proyecto: {
          connect: { id: updateRequisitoDto.proyectoId },
        },
        detalleRequisito: {
          create: updateRequisitoDto.detalleRequisito,
        },
      },
      include: {
        detalleRequisito: true, // para retornar los detalles actualizados
      },
    });

    return {
      data: { requisito },
    };
  }

  async updateRequisitoUpdatingDetail(external_id: string, updateRequisitoDto: UpdateRequisitoDto) {
    // const {...data } = updateRequisitoDto;
    const ultimoDetalle = await this.prisma.detalleRequisito.findFirst({
      where: { requisito: { external_id } },
      orderBy: { fechaCreacion: 'desc' }, // o por ID si es incremental
    });

    if (!ultimoDetalle) {
      throw new NotFoundException('No se encontró ningún detalleRequisito para este requisito');
    }

    const requisito = await this.prisma.requisito.update({
      where: { external_id },
      data: {
        // numeroRequisito: updateRequisitoDto.numeroRequisito,
        tipo: updateRequisitoDto.tipo,
        estado: updateRequisitoDto.estado,
        proyecto: {
          connect: { id: updateRequisitoDto.proyectoId }, 
        },
      },
    });
    await this.prisma.detalleRequisito.update({
      where: { id: ultimoDetalle.id },
      data: updateRequisitoDto.detalleRequisito[0],
    });
  
    return {
      data: { requisito },
    };
  }

  async remove(external_id: string) {
    const requisito = await this.prisma.requisito.findUnique({
      where: { external_id },
      include: { detalleRequisito: true, proyecto: true },
    });

    if (!requisito) {
      throw new Error('Requisito no encontrado');
    }

    // 1. Eliminar detalles del requisito
    await Promise.all(
      requisito.detalleRequisito.map((d) =>
        this.prisma.detalleRequisito.delete({ where: { id: d.id } })
      )
    );

    // 2. Eliminar el requisito principal
    await this.prisma.requisito.delete({
      where: { external_id },
    });

    // 3. Obtener y reordenar requisitos restantes del mismo proyecto
    const requisitosRestantes = await this.prisma.requisito.findMany({
      where: {
        proyectoId: requisito.proyectoId,
      },
      orderBy: {
        fechaCreacion: 'asc',
      },
    });

    // 4. Reasignar numeroRequisito
    await Promise.all(
      requisitosRestantes.map((req, index) =>
        this.prisma.requisito.update({
          where: { id: req.id },
          data: {
            numeroRequisito: (index + 1).toString(), // "1", "2", "3", ...
          },
        })
      )
    );

    return { message: 'Requisito eliminado y numeración actualizada' };
    }
}
