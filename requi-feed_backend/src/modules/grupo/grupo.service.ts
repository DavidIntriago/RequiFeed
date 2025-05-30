import { Injectable, OnModuleInit } from '@nestjs/common';
import { CreateGrupoDto } from './dto/create-grupo.dto';
import { UpdateGrupoDto } from './dto/update-grupo.dto';
import { PaginationDto } from 'src/common';
import { PrismaClient } from '@prisma/client';
import { PrismaService } from 'src/db/prisma.service';

@Injectable()
export class GrupoService {

  constructor(private prisma: PrismaService) { }


  async createGroupsbyRamdom(createGrupoDto: CreateGrupoDto) {
    const { nombre, cantidadGrupos, idPeriodoAcademico } = createGrupoDto;

    const rol = await this.prisma.rol.findFirst({
      where: { tipo: 'ANALISTA' },
    });

    if (!rol) throw new Error('Rol ANALISTA no encontrado');

    const cuentas = await this.prisma.cuenta.findMany({
      where: { rolId: rol.id },
      include: { usuario: true },
    });

    const usuarios = cuentas
      .filter((c) => c.usuario !== null)
      .map((c) => c.usuario);

    if (usuarios.length === 0) {
      throw new Error('No hay usuarios con rol ANALISTA');
    }

    const usuariosAleatorios = usuarios.sort(() => Math.random() - 0.5);
    const usuariosPorGrupo = Math.ceil(usuarios.length / cantidadGrupos);

    return this.prisma.$transaction(async (tx) => {
      const gruposCreados = [];

      for (let i = 0; i < cantidadGrupos; i++) {
        const nombreGrupo = `${nombre} ${i + 1}`;

        const grupo = await tx.grupo.create({
          data: {
            nombre: nombreGrupo,
            descripcion: 'Grupo generado aleatoriamente',
            idPeriodoAcademico,
          },

        });

        const inicio = i * usuariosPorGrupo;
        const fin = inicio + usuariosPorGrupo;
        const usuariosAsignados = usuariosAleatorios.slice(inicio, fin);

        for (const usuario of usuariosAsignados) {
          await tx.usuario.update({
            where: { id: usuario.id },
            data: { grupoId: grupo.id },
          });
        }

        gruposCreados.push(grupo);
      }

      return gruposCreados;
    });
  }

  async create(createGrupoDto: CreateGrupoDto) {
    const { nombre, descripcion, idPeriodoAcademico, usuarios } = createGrupoDto;
    console.log('usuarios', usuarios);

    if (!usuarios || usuarios.length === 0) {
      throw new Error('Debe proporcionar al menos un usuario');
    }

    const usuariosExistentes = await this.prisma.usuario.findMany({
    where: { id: { in: usuarios } },
    });

    if (usuariosExistentes.length !== usuarios.length) {
      throw new Error('Algunos usuarios no existen');
    }


    return this.prisma.$transaction(async (tx) => {
      const grupo = await tx.grupo.create({
        data: {
          nombre,
          descripcion,
          idPeriodoAcademico,
        },
      });

      for (const usuario of usuariosExistentes) {
        await tx.usuario.update({
          where: { id: usuario.id },
          data: { grupoId: grupo.id },
        });
      }

      

      return grupo;
    });
  }

  async findAllandUsers(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;
    const totalPages = await this.prisma.grupo.count();
    const lastPage = Math.ceil(totalPages / limit);
    const grupos = await this.prisma.grupo.findMany({
      include: {
        periodoAcademico: true,
      },
      
    });

    const gruposConUsuarios = await Promise.all(
      grupos.map(async (grupo) => {
        const usuarios = await this.prisma.usuario.findMany({
          where: { grupoId: grupo.id },
          include: {
            cuenta: true,
          },
        });
        return { ...grupo, usuarios };
      }),
    );
    return {
      data: gruposConUsuarios,
      meta: {
        total: totalPages,
        page: page,
        lastPage: lastPage,
      },
    };
  }

  async findOneGroup(external_id: string) {
    const grupo = await this.prisma.grupo.findFirst({
      where: { external_id: external_id },
      include: {
        periodoAcademico: true,
      },
      
    });

    const grupoUsuarios =  await this.prisma.usuario.findMany({
      where: { grupoId: grupo.id },
      include: {
      cuenta: {
        include: {
          Rol: true,
        },
      }
     },
    });
        // return { ...grupo, usuarios };
    
    return {
      data: grupoUsuarios,
    };
  }







  async findAll(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;

    const totalPages = await this.prisma.grupo.count();
    const lastPage = Math.ceil(totalPages / limit);

    return {
      data: await this.prisma.grupo.findMany({
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

  

}
