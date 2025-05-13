import { Injectable } from '@nestjs/common';
import { Login } from './dto/login';
import { PrismaService } from 'src/db/prisma.service';
import * as bcrypt from 'bcrypt';
import { Registry } from './dto/registry';

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

  
}
