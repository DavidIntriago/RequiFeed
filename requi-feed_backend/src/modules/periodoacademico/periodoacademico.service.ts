import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/db/prisma.service';
import { periodoAcademicoDto } from './dto/create-periodoacademico.dto';


@Injectable()
export class PeriodoacademicoService {
  constructor(private prisma: PrismaService) { }

  async createPeriodoAcademico(periodoAcademicoDto: periodoAcademicoDto) {
    const periodosExistente = await this.prisma.periodoAcademico.findFirst({
      where: {
        fechaInicio: periodoAcademicoDto.fechaInicio,
        fechaFin: periodoAcademicoDto.fechaFin,
      },
    });
    if (periodosExistente) {
      return {
        message: 'Ya existe un periodo academico con las mismas fechas',
      };
    }else{ 
      console.log(periodoAcademicoDto);
    
    const periodoAcademico = await this.prisma.periodoAcademico.create({
      data: {
        nombre: periodoAcademicoDto.nombre,
        modalidad: periodoAcademicoDto.modalidad,
        fechaInicio: periodoAcademicoDto.fechaInicio,
        fechaFin: periodoAcademicoDto.fechaFin,
      },
    });
    console.log(periodoAcademico);

    return {
    
      data: periodoAcademico,
    }
  }}

  async findPeridoActual() {
    const hoy = new Date();
    const periodoActual = await this.prisma.periodoAcademico.findFirst({
      where: {
        fechaInicio: {
          lte: hoy,
        },
        fechaFin: {
          gte: hoy,
        },
      },
      orderBy: {
        fechaInicio: 'desc',
      },
    });

    return {
      data: periodoActual,
    };
    
  }

  async findAll() {
    const periodos = await this.prisma.periodoAcademico.findMany({
      orderBy: {
        fechaInicio: 'desc',
      },
    });
    return {
      data: periodos,
    }
  }

  async updatePeriodoAcademico(id: number, periodoAcademicoDto: periodoAcademicoDto) {
  const periodoExistente = await this.prisma.periodoAcademico.findFirst({
    where: {
      fechaInicio: periodoAcademicoDto.fechaInicio,
      fechaFin: periodoAcademicoDto.fechaFin,
      NOT: {
        id,  },
    },
  });

  if (periodoExistente) {
    return {
      message: 'Ya existe un periodo académico con las mismas fechas',
    };
  }

  const periodoActualizado = await this.prisma.periodoAcademico.update({
    where: { id },
    data: {
      nombre: periodoAcademicoDto.nombre,
      modalidad: periodoAcademicoDto.modalidad,
      fechaInicio: periodoAcademicoDto.fechaInicio,
      fechaFin: periodoAcademicoDto.fechaFin,
    },
  });

  return {
    data: periodoActualizado,
  };
}


}
