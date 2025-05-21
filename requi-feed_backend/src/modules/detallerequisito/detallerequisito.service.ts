import { Injectable } from '@nestjs/common';
import { CreateDetallerequisitoDto } from './dto/create-detallerequisito.dto';
import { UpdateDetallerequisitoDto } from './dto/update-detallerequisito.dto';

@Injectable()
export class DetallerequisitoService {
  create(createDetallerequisitoDto: CreateDetallerequisitoDto) {
    return 'This action adds a new detallerequisito';
  }

  findAll() {
    return `This action returns all detallerequisito`;
  }

  findOne(id: number) {
    return `This action returns a #${id} detallerequisito`;
  }

  update(id: number, updateDetallerequisitoDto: UpdateDetallerequisitoDto) {
    return `This action updates a #${id} detallerequisito`;
  }

  remove(id: number) {
    return `This action removes a #${id} detallerequisito`;
  }
}
