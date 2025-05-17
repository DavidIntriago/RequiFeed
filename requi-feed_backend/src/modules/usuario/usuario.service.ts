import { Injectable } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { PrismaService } from 'src/db/prisma.service';
import * as bcrypt from 'bcrypt';
import { PaginationDto } from 'src/common';

@Injectable()
export class UsuarioService {
  

    constructor(private prisma: PrismaService) {}

  


  
  
  create(createUsuarioDto: CreateUsuarioDto) {
    return this.prisma.usuario.create({
      data: createUsuarioDto,
    });
  }

  async findAll(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;
    
    const totalPages = await this.prisma.usuario.count();
    const lastPage = Math.ceil(totalPages / limit);
    
    return {
      data: await this.prisma.usuario.findMany({
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

  findOne(id: number) {
    return `This action returns a #${id} usuario`;
  }

  remove(id: number) {
    return `This action removes a #${id} usuario`;
  }
}
