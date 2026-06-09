// src/auth/guard/roles.guard.ts
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../../common/enums/rol.enum';
import { ROLES_KEY } from '../decorators/auth.decorators';

// Jerarquía: super_admin puede todo lo que admin puede,
// y admin puede todo lo que user puede.
const ROLE_HIERARCHY: Record<Role, number> = {
  [Role.USER]: 1,
  [Role.ADMIN]: 2,
  [Role.SUPER_ADMIN]: 3,
};

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    if (!user || !user.role) {
      throw new ForbiddenException('Usuario no autenticado');
    }

    // El rol del usuario tiene que ser >= al rol requerido más bajo
    const userLevel = ROLE_HIERARCHY[user.role as Role] ?? 0;
    const minRequired = Math.min(
      ...requiredRoles.map((r) => ROLE_HIERARCHY[r] ?? 99),
    );

    const hasAccess = userLevel >= minRequired;

    if (!hasAccess) {
      throw new ForbiddenException(
        `Se requiere uno de estos roles: ${requiredRoles.join(', ')}`,
      );
    }

    return true;
  }
}
