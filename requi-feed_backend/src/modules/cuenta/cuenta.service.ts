import { BadRequestException, Injectable } from '@nestjs/common';
import { Login } from './dto/login';
import { PrismaService } from 'src/db/prisma.service';
import * as bcrypt from 'bcrypt';
import { Registry } from './dto/registry';
import { PaginationDto } from 'src/common';
import { CreateCuentaDto } from './dto/create-cuenta.dto';
import { UpdateCuentaDto } from './dto/update-cuenta.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ChangeRolDto } from './dto/change-rol.dto';

@Injectable()
export class CuentaService {
  constructor(private prisma: PrismaService) { }

  async login(login: Login) {
    const cuenta = await this.prisma.cuenta.findFirst({
      where: {
        email: login.email,
      },
      include: {
        Rol: true
      }
    });
    if (!cuenta) {
      throw new Error("Credenciales incorrectas");
    }

    const isMatch = await bcrypt.compare(login.contrasenia, cuenta.contrasenia
    );

    const usuario = await this.prisma.usuario.findFirst({
      where: {
        cuentaId: cuenta.id,
      },
    });
    
    console.log(usuario);
    console.log(cuenta);


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

      if (!usuario) {
        return {
          data: {
            token: jwt,
            external_id: cuenta.external_id,
            rol: cuenta.Rol.tipo

          }
        };
      }
      return {
        data: {
          usuario: usuario.nombre + " " + usuario.apellido,
          token: jwt,
          external_id: cuenta.external_id,
          rol: cuenta.Rol.tipo
        }
      };
    }

  }

  async registry(registry: Registry) {
  const { email, contrasenia, ...usuarioFields } = registry;

  //Verifica cuenta existente
  const cuentaExistente = await this.prisma.cuenta.findFirst({
    where: {
      email,
    },
  });

  if (cuentaExistente) {
    throw new BadRequestException("El correo electrónico ya está en uso");
  }

  //Verifica rol
  return this.prisma.$transaction(async (prisma) => {
    const rol = await prisma.rol.findFirst({
      where: {
        tipo: "ANALISTA",
      },
    });

    if (!rol) {
      throw new Error("Rol ANALISTA no encontrado");
    }

    //Crea cuenta
    const cuenta = await prisma.cuenta.create({
      data: {
        email,
        contrasenia: await bcrypt.hash(contrasenia, 10),
        estado: "ACTIVA",
        rolId: rol.id,
      },
      include: {
        Rol: true,
        
      },
    });

    

    const usuarioData = {
      ...usuarioFields,
      cuentaId: cuenta.id,
    };

    //Crea usuario
    const usuario = await prisma.usuario.create({
      data: usuarioData,
      include: {
        cuenta: true,
        
      },
    });

    return {
      data: {
      usuario,
        cuenta
      
      },
    };
    });
  }

  async changePassword(external_id: string, changePasswordDto: ChangePasswordDto) {
    const cuenta = await this.prisma.cuenta.findFirst({
      where: {
        external_id,
      },
    });

    if (!cuenta) {
      throw new BadRequestException("El correo electrónico no está registrado");
    }
    const isMatch = await bcrypt.compare(changePasswordDto.contraseniaActual, cuenta.contrasenia
    ); 

    if (!isMatch) {
      throw new BadRequestException("Contraseña actual incorrecta");
    }
    if (changePasswordDto.contrasenia !== changePasswordDto.contraseniaConfirm) {
      throw new BadRequestException("Las contraseñas no coinciden");
    }
    
    const hashedPassword = await bcrypt.hash(changePasswordDto.contrasenia, 10);
    const cuentaActualizada = await this.prisma.cuenta.update({
      where: { external_id },
      data: {
        contrasenia: hashedPassword,
      },
    });
    return {
      data: cuentaActualizada,
    };
  }

  async update(external_id: string, updateCuentaDto: UpdateCuentaDto) {
    const { id: __, ...data } = updateCuentaDto;

    console.log(external_id);
    console.log(data);
    
    // Verifica si la cuenta existe
    const cuentaExistente = await this.prisma.cuenta.findFirst({
      where: {
        email: data.email,
        NOT: {
          external_id: external_id,
        },
      },
      

    });

    if (cuentaExistente) {
      throw new BadRequestException("El correo electrónico ya está en uso");
    }

    // Actualiza la cuenta
    const cuenta = await this.prisma.cuenta.update({
      where: { external_id },
      data: {
        email: data.email,
        estado: data.estado
      },
    });

    // Actualiza el usuario
    const usuario = await this.prisma.usuario.update({
      where: { cuentaId: cuenta.id },
      data: {
        nombre: data.nombre,
        apellido: data.apellido,
        ocupacion: data.ocupacion,
        area: data.area,
        foto: data.foto,
      },
    });


    return {
      data: {cuenta, usuario},
    };
  }

  async cambiarRol(external_id: string, changeRolDto: ChangeRolDto) {

    // Busca el rol
    const rol = await this.prisma.rol.findFirst({
      where: {
        tipo: changeRolDto.rolType,
      },
    });
    if (!rol) {
      throw new BadRequestException("Rol no encontrado");
    }

    const cuenta = await this.prisma.cuenta.update({
      where: { external_id },
      data: {
        rolId: rol.id,
      },
    });
    return {
      data: {cuenta},
    };
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

  async findOne(external_id: string){
    const user = await this.prisma.cuenta.findFirst({
          where: { external_id  },
          include: {
            usuario: true
          }
    });

    if (!user) {
      throw new Error("Usuario no encontrado");
    }
    return {
      data: user
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

  
async findByEmail(email: string) {
  const cuenta = await this.prisma.cuenta.findFirst({
    where: {
      email,
    },
  });

  if (!cuenta) {
    throw new BadRequestException("El correo electrónico no está registrado");
  }

  return{ data: cuenta };

  
}
 
async updateContrasenia(email: string, contrasenia: string) {
  const cuenta = await this.prisma.cuenta.findUnique({
    where: { email },
  });

  if (!cuenta) {
    throw new BadRequestException("Cuenta no encontrada");
  }

  const hashedPassword = await bcrypt.hash(contrasenia, 10);

  return this.prisma.cuenta.update({
    where: { email },
    data: { contrasenia: hashedPassword },
  });

}
}




