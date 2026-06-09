import {
  Controller,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  ParseIntPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Auth } from '../auth/decorators/auth.decorators';
import { ActiveUser } from '../common/decorators/active-user.decorator';
import { Role } from '../common/enums/rol.enum';
import type { UserActiveInterface } from '../common/interfaces/user-active.interface';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // GET /users/me — perfil propio
  @Get('me')
  @Auth(Role.USER)
  getMe(@ActiveUser() activeUser: UserActiveInterface) {
    // Usa findMyProfile que ya existe y carga relaciones
    return this.usersService.findMyProfile(activeUser);
  }

  // PATCH /users/me/perfil — actualizar perfil propio
  @Patch('me/perfil')
  @Auth(Role.USER)
  updateMe(
    @ActiveUser() activeUser: UserActiveInterface,
    @Body() dto: UpdateProfileDto,
  ) {
    // updateProfile(id, dto, activeUser) — firma real del service
    return this.usersService.updateProfile(activeUser.sub, dto, activeUser);
  }

  // GET /users — admin ve su sucursal, super_admin ve todos
  @Get()
  @Auth(Role.ADMIN)
  findAll(@ActiveUser() activeUser: UserActiveInterface) {
    // findAll(activeUser) — firma real del service
    return this.usersService.findAll(activeUser);
  }

  // GET /users/:id
  @Get(':id')
  @Auth(Role.ADMIN)
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @ActiveUser() activeUser: UserActiveInterface,
  ) {
    // findOne(id, activeUser) — firma real del service
    return this.usersService.findOne(id, activeUser);
  }

  // PATCH /users/:id/perfil — admin edita empleado de su sucursal
  @Patch(':id/perfil')
  @Auth(Role.ADMIN)
  updateProfile(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProfileDto,
    @ActiveUser() activeUser: UserActiveInterface,
  ) {
    return this.usersService.updateProfile(id, dto, activeUser);
  }

  // DELETE /users/:id — soft delete, solo super_admin
  @Delete(':id')
  @Auth(Role.SUPER_ADMIN)
  remove(@Param('id', ParseIntPipe) id: number) {
    // remove(id) — firma real del service
    return this.usersService.remove(id);
  }
}
