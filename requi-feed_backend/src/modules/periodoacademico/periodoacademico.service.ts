import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/db/prisma.service';
import { periodoAcademicoDto } from './dto/create-periodoacademico.dto';


@Injectable()
export class PeriodoacademicoService {
  constructor(private prisma: PrismaService) { }

  async createPeriodoAcademico(periodoAcademicoDto: periodoAcademicoDto) {
    const periodoAcademico = await this.prisma.periodoAcademico.create({
      data: {
        nombre: periodoAcademicoDto.nombre,
        PeriodoAcademico: periodoAcademicoDto.PeriodoAcademico,
        modalidad: periodoAcademicoDto.modalidad,
      },
    });
    return {
      data: periodoAcademico,
    }
  }

  findUltimoPeriodoAcademico() {
    return this.prisma.periodoAcademico.findFirst({
      orderBy: {
        id: 'desc',
      },
    });
  }

}
