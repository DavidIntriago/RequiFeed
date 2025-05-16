import { Injectable } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { PrismaService } from 'src/db/prisma.service';
import * as bcrypt from 'bcrypt';
import { PaginationDto } from 'src/common';

@Injectable()
export class UsuarioService {
  

    constructor(private prisma: PrismaService) {}

  async createAdmin() {
  const usuarioDto: CreateUsuarioDto = {} as CreateUsuarioDto;

  if (!process.env.ADMIN_CORREO || !process.env.ADMIN_CLAVE) {
    throw new Error('ADMIN_CORREO o ADMIN_CLAVE no están definidas');
  }

  const existingAdmin = await this.prisma.cuenta.findUnique({
    where: { email: process.env.ADMIN_CORREO }
  });

  if (existingAdmin) {
    console.log("El administrador ya existe");
    return existingAdmin;
  }

  const salt = parseInt(process.env.CODE_BCRYPT_SALT || '10');
  const hashedPassword = await bcrypt.hash(process.env.ADMIN_CLAVE, salt);

  return this.prisma.$transaction(async (prisma) => {
    const cuenta = await prisma.cuenta.create({
      data: {
        email: process.env.ADMIN_CORREO,
        contrasenia: hashedPassword,
        estado: "ACTIVA",
        Rol: {
          connect: { id: 1 }  // conecta con el Rol que existe en la BD
        }
      },
    });

    const rol = await prisma.rol.findFirst({
      where: { tipo: "DOCENTE" },
    });

    if (!rol) throw new Error('No se encontró un rol tipo DOCENTE');

    const usuarioData = {
      ...usuarioDto,
      cuentaId: cuenta.id,
      // idRol: rol.id
    };

    console.log(usuarioData);

    const usuario = await prisma.usuario.create({
      data: usuarioData,
      include: {
        cuenta: true,
        // rol: true,
      },
    });

    console.log("Administrador creado");

    return { cuenta, usuario };
  });
}


  
  
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
