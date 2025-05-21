import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CuentaService } from '../cuenta/cuenta.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: CuentaService,
  ) {}

  async generatePasswordResetToken(email: string): Promise<string | null> {
    const cuenta = await this.usersService.findByEmail(email);
    if (!cuenta) return null;

    const payload = { sub: cuenta.data.external_id, email: cuenta.data.email };
    const token = this.jwtService.sign(payload);
    console.log(token);
    return token;
  }

  async verifyPasswordResetToken(token: string) {
    try {
      const result = this.jwtService.verify(token);
      console.log(result);
      return result;
    } catch {
      return null;
    }
  }
}

