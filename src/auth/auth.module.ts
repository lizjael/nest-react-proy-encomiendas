import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants/jwt.constant';
import { RolesGuard } from './guard/roles.guard';
import { AuthGuard } from './guard/auth.guard';
//MODULE PERMITE LA SALIDA O ENTRADA DE SERVICIOS, PROVEEDORES, CONTROLADORES, ETC.
@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      global: true, //global nos dice q cualquier servicio puede usar jwt
      secret: jwtConstants.secret, //secret es la clave secreta para firmar los tokens esto nos lleva a unas constantes
      signOptions: { expiresIn: '1d' }, //la expliracion
      //aqui podríamos implementar el refresh token
      //para una plicacion mas grande es recomendable usar el refresh token para evitar que los usuarios tengan que volver a iniciar sesion cada vez que expira el token, el refresh token es un token que se usa para obtener un nuevo token de acceso cuando el token de acceso expira, el refresh token tiene una expliracion mas larga que el token de acceso, por lo general el refresh token tiene una expliracion de 7 dias o mas, esto nos permite mantener a los usuarios autenticados por un periodo de tiempo mas largo sin tener que volver a iniciar sesion cada vez que expira el token de acceso, para implementar el refresh token tendriamos que crear un nuevo endpoint para obtener un nuevo token de acceso a partir del refresh token, este endpoint recibiria el refresh token y si el refresh token es valido entonces se generaria un nuevo token de acceso y se devolveria al usuario, esto nos permite mantener a los usuarios autenticados por un periodo de tiempo mas largo sin tener que volver a iniciar sesion cada vez que expira el token de acceso
    }),
  ], // traemos todo el modulo de users
  controllers: [AuthController],
  providers: [AuthService, AuthGuard, RolesGuard],
  exports: [AuthGuard, RolesGuard, JwtModule],
})
export class AuthModule {}
