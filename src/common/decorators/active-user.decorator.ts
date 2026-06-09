import { createParamDecorator, ExecutionContext } from '@nestjs/common';

//activeuser es para cuando tengamos una ruta protegida, sepamos que siempre va a existir un usuario.
export const ActiveUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  }, //esto nos permite acceder al usuario que inyectamos en el guard de autenticacion, esto nos permite acceder a la informacion del usuario que hizo la peticion, en este caso el email del usuario que esta guardado en el token
);
