import { Injectable, OnModuleInit } from '@nestjs/common';
import { CreateGrupoDto } from './dto/create-grupo.dto';
import { UpdateGrupoDto } from './dto/update-grupo.dto';
import { PaginationDto } from 'src/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class GrupoService extends PrismaClient implements OnModuleInit{
  async onModuleInit() {
        await this.$connect();
  }

  create(createGrupoDto: CreateGrupoDto) {
    return 'This action adds a new grupo';
  }

  async findAll(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;
    
        const totalPages = await this.grupo.count();
        const lastPage = Math.ceil(totalPages / limit);
    
        return {
          data: await this.grupo.findMany({
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
    return `This action returns a #${id} grupo`;
  }

  update(id: number, updateGrupoDto: UpdateGrupoDto) {
    return `This action updates a #${id} grupo`;
  }

  remove(id: number) {
    return `This action removes a #${id} grupo`;
  }
}
