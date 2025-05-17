import { Injectable } from '@nestjs/common';
import { Login } from './dto/login';
import { PrismaService } from 'src/db/prisma.service';
import * as bcrypt from 'bcrypt';
import { Registry } from './dto/registry';
import { PaginationDto } from 'src/common';
import { CreateCuentaDto } from './dto/create-cuenta.dto';

@Injectable()
export class CuentaService {
  constructor(private prisma: PrismaService) { }

  async login(login: Login) {
    const cuenta = await this.prisma.cuenta.findFirst({
      where: {
        email: login.email,
      },
    });
    if (!cuenta) {
      throw new Error("Credenciales incorrectas");
    }

    const isMatch = await bcrypt.compare(login.contrasenia, cuenta.contrasenia
    );


    if (!isMatch) {
      throw new Error("Credenciales incorrectas");
    } else {
      const token_data = {
        external_token: cuenta.external_id,
        email: cuenta.email,
        check: true
      };
      const key = process.env.KEY_JWT || 'default_key';
      const jwt = require('jsonwebtoken').sign(token_data, key, { expiresIn: '1h' });
      console.log(jwt);

      return {
        data: {
          token: jwt,
          external_id: cuenta.external_id,
        }
      };
    }

  }

  async registry(registry: Registry) {
  const { email, contrasenia, ...usuarioFields } = registry;

  const cuentaExistente = await this.prisma.cuenta.findFirst({
    where: {
      email,
    },
  });

  if (cuentaExistente) {
    throw new Error("El correo ya existe");
  }

  return this.prisma.$transaction(async (prisma) => {
    const cuenta = await prisma.cuenta.create({
      data: {
        email,
        contrasenia: await bcrypt.hash(contrasenia, 10),
        estado: "ACTIVA",
        rolId: 1,
      },
    });

    const rol = await prisma.rol.findFirst({
      where: {
        tipo: "ANALISTA",
      },
    });

    if (!rol) {
      throw new Error("Rol ANALISTA no encontrado");
    }

    const usuarioData = {
      ...usuarioFields,
      cuentaId: cuenta.id,
      idRol: rol.id,
    };

    const usuario = await prisma.usuario.create({
      data: usuarioData,
      include: {
        cuenta: true,
        // rol: true,
      },
    });

    return {
      data: {
      cuenta,
      usuario,
      },
    };
  });
}

  async findAll(paginationDto: PaginationDto) {
      const { page, limit } = paginationDto;
      
      const totalPages = await this.prisma.cuenta.count();
      const lastPage = Math.ceil(totalPages / limit);
  
      return {
        data: await this.prisma.cuenta.findMany({
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

  async create(createCuentaDto: CreateCuentaDto) {
    return this.prisma.cuenta.create({
      data: createCuentaDto,
    });
  }

  async createAdmin() {
  const dataDto: CreateCuentaDto = {} as CreateCuentaDto;

  if (!process.env.ADMIN_CORREO || !process.env.ADMIN_CLAVE) {
    throw new Error('ADMIN_CORREO o ADMIN_CLAVE no están definidas');
  }

  const existingAdmin = await this.prisma.cuenta.findUnique({
    where: { email: process.env.ADMIN_CORREO }
  });

  if (existingAdmin) {
    console.log("El Docente ya existe");
    return existingAdmin;
  }

   const rol = await this.prisma.rol.findFirst({
      where: { tipo: "DOCENTE" },
    });

    if (!rol) throw new Error('No se encontró un rol tipo DOCENTE');

    

  const salt = parseInt(process.env.CODE_BCRYPT_SALT || '10');
  const hashedPassword = await bcrypt.hash(process.env.ADMIN_CLAVE, salt);

  const dataCuenta = {
    ...dataDto, 
    email: process.env.ADMIN_CORREO,
    contrasenia: hashedPassword,
    estado: "ACTIVA",
    rolId: rol.id,
  };

  return this.prisma.$transaction(async (prisma) => {
    const cuenta = await prisma.cuenta.create({
      data: dataCuenta,
    });

    console.log("Docente creado");

    return { cuenta };
  });
}

  
}
