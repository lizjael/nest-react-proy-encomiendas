// src/auth/decorators/auth.decorators.ts
import { applyDecorators, UseGuards, SetMetadata } from '@nestjs/common';
import { Role } from '../../common/enums/rol.enum';
import { RolesGuard } from '../guard/roles.guard';
import { AuthGuard } from '../guard/auth.guard';

export const ROLES_KEY = 'roles';

export function Auth(...roles: Role[]) {
  return applyDecorators(
    SetMetadata(ROLES_KEY, roles),
    UseGuards(AuthGuard, RolesGuard),
  );
}
