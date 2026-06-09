import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientesModule } from './clientes/clientes.module';
import { ConsignatariosModule } from './consignatarios/consignatarios.module';
import { PagosModule } from './pagos/pagos.module';
import { SucursalesModule } from './sucursales/sucursales.module';

import { EncomiendasModule } from './encomiendas/encomiendas.module';
import { DetalleEncomiendasModule } from './detalle-encomienda/detalle-encomienda.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5433, // o 5432 según tu instalación
      username: 'postgres',
      password: '123456',
      database: 'db_encomienda',
      autoLoadEntities: true,
      synchronize: true,
    }),
    ClientesModule,
    ConsignatariosModule,
    PagosModule,
    SucursalesModule,

    EncomiendasModule,
    DetalleEncomiendasModule,
    //ClientesModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
