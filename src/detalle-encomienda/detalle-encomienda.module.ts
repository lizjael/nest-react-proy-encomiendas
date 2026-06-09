// detalle-encomiendas/detalle-encomiendas.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DetalleEncomiendasService } from './detalle-encomienda.service';
import { DetalleEncomiendasController } from './detalle-encomienda.controller';
import { DetalleEncomienda } from './entities/detalle-encomienda.entity';
import { Encomienda } from '../encomiendas/entities/encomienda.entity';
import { AuthModule } from '../auth/auth.module';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([DetalleEncomienda, Encomienda, User]),
    AuthModule,
  ],
  controllers: [DetalleEncomiendasController],
  providers: [DetalleEncomiendasService],
  exports: [DetalleEncomiendasService],
})
export class DetalleEncomiendasModule {}
