import { Injectable } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { PrismaService } from 'src/db/prisma.service';
import * as bcrypt from 'bcrypt';
import { PaginationDto } from 'src/common';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';

@Injectable()
export class UsuarioService {


  constructor(private prisma: PrismaService) { }

  create(createUsuarioDto: CreateUsuarioDto) {
    return this.prisma.usuario.create({
      data: createUsuarioDto,
    });
  }

  // renameImage(req, file, callback)

  async findUsersByRol() {
    const analistas = await this.prisma.usuario.findMany({
      where: {
        cuenta: {
          Rol: {
            tipo: 'ANALISTA',
          },
        },
      },
      include: {
        cuenta: {
          include: {
            Rol: true,
          },
        }


      },
    });
    const lider = await this.prisma.usuario.findMany({
      where: {
        cuenta: {
          Rol: {
            tipo: 'LIDER',
          },
        },
      },
      include: {
        cuenta: true,
      },
    });



    return {
      data: 
        analistas, lider,
      
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;

    const totalPages = await this.prisma.usuario.count();
    const lastPage = Math.ceil(totalPages / limit);

    return {
      data: await this.prisma.usuario.findMany({
        skip: (page - 1) * limit,
        take: limit,
        include: {
          cuenta: {
            include: {
              Rol: true,
            }
          },
          grupo: true,
        },

      }),

      meta: {
        total: totalPages,
        page: page,
        lastPage: lastPage,
      },
    };
  }

  async update(id: number, updateCuentaDto: UpdateUsuarioDto) {
    const { id: __, ...data } = updateCuentaDto;

    console.log(id);
    console.log(data);

    const usuarioUpdated = await this.prisma.usuario.update({
      where: { id },
      data: data,
    });

    return {
      data: usuarioUpdated,
    };
  }

  // async findOne(external_id: string) {
  //   const catalog = await this.prisma.usuario.findFirst({
  //         where: { external_id},
  //         include: {
  //           cuenta: true
  //         }
  //       });

  //       return catalog;
  // }

  remove(id: number) {
    return `This action removes a #${id} usuario`;
  }
}


