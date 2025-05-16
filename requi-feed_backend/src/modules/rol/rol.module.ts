import { Module } from '@nestjs/common';
import { RolController } from './rol.controller';
import { RolService } from './rol.service';
import { PrismaService } from 'src/db/prisma.service';

@Module({
  
  controllers: [RolController],
  providers: [RolService, {provide: PrismaService,
    useFactory: () => PrismaService.getInstance()
  }],
})
export class RolModule {}
