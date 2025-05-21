import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,       
        pass: process.env.GMAIL_APP_PASS,  
      },
    });
  }

  async sendRecoveryEmail(to: string, token: string) {
    const url = `http://localhost:3000/authentication/password-update?token=${token}`;  

    const mailOptions = {
      from: `"Tu App" <${process.env.GMAIL_USER}>`,
      to,
      subject: 'Recuperación de contraseña',
      html: `<p>Para recuperar tu contraseña, haz clic en el siguiente enlace:</p>
             <a href="${url}">${url}</a>
             <p>Este enlace expirará en 1 hora.</p>`,
    };

    return this.transporter.sendMail(mailOptions);
  }
}
