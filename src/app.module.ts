import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientesModule } from './clientes/clientes.module';
import { ConsignatariosModule } from './consignatarios/consignatarios.module';
import { PagosModule } from './pagos/pagos.module';
import { SucursalesModule } from './sucursales/sucursales.module';

import { EncomiendasModule } from './encomiendas/encomiendas.module';
import { DetalleEncomiendasModule } from './detalle-encomienda/detalle-encomienda.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        username: config.get('DB_USERNAME'),
        password: config.get('DB_PASSWORD'),
        database: config.get('DB_DATABASE'),
        autoLoadEntities: true,
        synchronize: true,
        ssl: {
          rejectUnauthorized: false,
        },
      }),
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
