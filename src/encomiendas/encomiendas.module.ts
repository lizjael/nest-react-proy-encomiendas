import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EncomiendasService } from './encomiendas.service';
import { EncomiendasController } from './encomiendas.controller';
import { Encomienda } from './entities/encomienda.entity';
import { Cliente } from '../clientes/entities/cliente.entity';
import { Consignatario } from '../consignatarios/entities/consignatario.entity';
import { User } from '../users/entities/user.entity';
import { Sucursal } from '../sucursales/entities/sucursal.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Encomienda,
      Cliente,
      Consignatario,
      User,
      Sucursal,
    ]),
    AuthModule,
  ],
  controllers: [EncomiendasController],
  providers: [EncomiendasService],
  exports: [EncomiendasService],
})
export class EncomiendasModule {}
