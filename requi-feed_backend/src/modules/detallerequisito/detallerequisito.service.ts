import { Injectable } from '@nestjs/common';
import { CreateDetallerequisitoDto } from './dto/create-detallerequisito.dto';
import { UpdateDetallerequisitoDto } from './dto/update-detallerequisito.dto';
import { PrismaService } from 'src/db/prisma.service';

@Injectable()
export class DetallerequisitoService {
    constructor(private prisma: PrismaService) { }
  
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

  async createRevision(id: number) {
    const detalleRequisito = await this.prisma.detalleRequisito.findFirst({
      where: {
        id: id,
      },
      include: {
        Revision: true,
      },
    });
    if (!detalleRequisito) {
      throw new Error('Detalle de requisito no encontrado');
    }
    const revision = await this.prisma.revision.create({
      data: {
        fecha: new Date(),
        detalleRequisitoId: detalleRequisito.id,
      },
    });
    return {
      data: revision,
    
}
};



}
