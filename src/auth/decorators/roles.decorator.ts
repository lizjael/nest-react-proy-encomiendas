// src/auth/decorators/roles.decorator.ts
import { SetMetadata } from '@nestjs/common';
import { Role } from '../../common/enums/rol.enum';
import { ROLES_KEY } from './auth.decorators';

export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
