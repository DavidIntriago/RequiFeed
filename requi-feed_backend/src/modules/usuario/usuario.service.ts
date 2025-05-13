import { Injectable } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { PrismaService } from 'src/db/prisma.service';
import * as bcrypt from 'bcrypt';

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
      },
    });

    const rol = await prisma.rol.findFirst({
      where: { tipo: "DOCENTE" },
    });

    if (!rol) throw new Error('No se encontró un rol tipo DOCENTE');

    const usuarioData = {
      ...usuarioDto,
      cuentaId: cuenta.id,
      idRol: rol.id
    };

    console.log(usuarioData);

    const usuario = await prisma.usuario.create({
      data: usuarioData,
      include: {
        cuenta: true,
        rol: true,
      },
    });

    console.log("Administrador creado");

    return { cuenta, usuario };
  });
}


  
  
  create(createUsuarioDto: CreateUsuarioDto) {
    return 'This action adds a new usuario';
  }

  findAll() {
    return `This action returns all usuario`;
  }

  findOne(id: number) {
    return `This action returns a #${id} usuario`;
  }



  remove(id: number) {
    return `This action removes a #${id} usuario`;
  }
}
