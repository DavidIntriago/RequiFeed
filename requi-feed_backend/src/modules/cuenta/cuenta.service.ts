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
      console.log(page + " holaaaaaa" + limit);
      
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

  
}
