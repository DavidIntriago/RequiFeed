import { Injectable } from '@nestjs/common';
import { CreateRequisitoDto } from './dto/create-requisito.dto';
import { UpdateRequisitoDto } from './dto/update-requisito.dto';

@Injectable()
export class RequisitoService {
  create(createRequisitoDto: CreateRequisitoDto) {
    return 'This action adds a new requisito';
  }

  findAll() {
    return `This action returns all requisito`;
  }

  findOne(id: number) {
    return `This action returns a #${id} requisito`;
  }

  update(id: number, updateRequisitoDto: UpdateRequisitoDto) {
    return `This action updates a #${id} requisito`;
  }

  remove(id: number) {
    return `This action removes a #${id} requisito`;
  }
}
