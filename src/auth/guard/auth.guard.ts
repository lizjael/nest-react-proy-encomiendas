import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { jwtConstants } from '../constants/jwt.constant';

@Injectable()
//CanAtive solo se utiliza cuando el usuario quiera solicitar una ruta protegida
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  //el canActivate es el metodo de Nest que se activa antes de una peticion
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest(); //request es lo q envia el cliente
    //console.log(request.headers.authorization); //aqui podemos ver el header de la peticion, en el header es donde se envia el token de autenticacion

    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: jwtConstants.secret, //verificamos el token con la clave secreta definida en el modulo de auth, si el token es valido nos devuelve el payload que es la informacion que guardamos en el token al momento de crearlo, en este caso el email del usuario
      });

      //request['user'] = payload; //inyectamos al usuario esto quiere decir que el request tenra una nueva propiedad user que contiene el payload
      request.user = payload; //esta es otra forma de inyectar al usuario, es lo mismo que la linea anterior pero con una sintaxis diferente, esta es la forma recomendada por NestJS
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
