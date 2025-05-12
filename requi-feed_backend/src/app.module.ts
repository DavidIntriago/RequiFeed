import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './db/prisma.service';

@Module({
  imports: [
    
  ],
  controllers: [AppController],
  providers: [{provide: PrismaService,
    useFactory: () => PrismaService.getInstance()
  }]
})
export class AppModule {}
