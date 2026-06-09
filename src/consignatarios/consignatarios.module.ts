import { Module } from '@nestjs/common';
import { ConsignatariosService } from './consignatarios.service';
import { ConsignatariosController } from './consignatarios.controller';
import { Consignatario } from './entities/consignatario.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Consignatario])],
  controllers: [ConsignatariosController],
  providers: [ConsignatariosService],
})
export class ConsignatariosModule {}
