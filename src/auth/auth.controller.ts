import { Body, Controller, Get, Post, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from './guard/auth.guard';
import { Request } from 'express';
import { Roles } from './decorators/roles.decorator';
import { RolesGuard } from './guard/roles.guard';
import { Role } from '../common/enums/rol.enum';
import { Auth } from './decorators/auth.decorators';
import type { UserActiveInterface } from 'src/common/interfaces/user-active.interface';
import { ActiveUser } from 'src/common/decorators/active-user.decorator';

interface RequestWithUser extends Request {
  user: {
    email: string;
    role: string;
  };
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(
    //para registrar la informacion recibimos un body
    @Body()
    registerDto: RegisterDto,
  ) {
    console.log(registerDto);
    return this.authService.register(registerDto);
  }

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  //este es un ejemplo de ruta protegida
  // @Get('profile')
  // //aqui podríamos ponerlo como un array: @Roles('admin', 'user') para indicar que esta ruta puede ser accedida por usuarios con rol admin o user, esto nos permite tener rutas que pueden ser accedidas por diferentes tipos de usuarios, pero en este caso solo queremos que los usuarios con rol admin puedan acceder a esta ruta, por eso solo ponemos el rol admin
  // @Roles(Role.USER) //este decorador me servira para indicar que tipo de rol necesita mi ruta
  // @UseGuards(AuthGuard, RolesGuard) //protegemos esta ruta con el guard de autenticacion, esto significa que solo los usuarios autenticados pueden acceder a esta ruta
  // profile(
  //   @Req() req: RequestWithUser, //aqui recibimos el request para poder acceder al usuario que inyectamos en el guard de autenticacion, esto nos permite acceder a la informacion del usuario que hizo la peticion, en este caso el email del usuario que esta guardado en el token
  // ) {
  //   return this.authService.profile(req.user); //aqui llamamos al metodo profile del servicio de autenticacion, este metodo recibe el email del usuario que esta guardado en el token, esto nos permite obtener la informacion del usuario a partir de su email, en este caso el email es unico por lo que no es necesario el id del usuario para obtener su informacion, pero si quisieramos obtener la informacion a partir del id del usuario entonces tendriamos que guardar el id del usuario en el token al momento de crearlo y luego acceder a ese id en el guard de autenticacion para poder obtener la informacion del usuario a partir de su id
  // }

  @Get('profile')
  @Auth(Role.USER) //este decorador me servira para indicar que tipo de rol necesita mi ruta, este decorador es una combinacion de los decoradores de roles y guards, esto nos permite tener una sintaxis mas limpia y facil de entender, ademas de que nos permite evitar errores al olvidar poner alguno de los decoradores necesarios para proteger la ruta, con este decorador solo necesitamos indicar el rol necesario para acceder a la ruta y el decorador se encargara de aplicar los guards necesarios para proteger la ruta
  profile(@ActiveUser() user: UserActiveInterface) {
    return this.authService.profile(user); // sin cambios aquí
  }
}
