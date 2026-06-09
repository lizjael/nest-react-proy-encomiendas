// src/users/users.service.ts
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UserActiveInterface } from '../common/interfaces/user-active.interface';
import { Role } from '../common/enums/rol.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  create(createUserDto: CreateUserDto) {
    return this.userRepository.save(createUserDto);
  }

  findOneByEmail(email: string) {
    return this.userRepository.findOne({ where: { email } });
  }

  findByEmailWithPassword(email: string) {
    return this.userRepository.findOne({
      where: { email },
      select: { id: true, name: true, email: true, password: true, role: true },
    });
  }

  // Lista todos los usuarios. SUPER_ADMIN ve todos, ADMIN ve solo los de su sucursal.
  async findAll(activeUser: UserActiveInterface) {
    if (activeUser.role === Role.SUPER_ADMIN) {
      return this.userRepository.find({
        relations: { sucursal: true, supervisor: true },
      });
    }

    if (activeUser.role === Role.ADMIN) {
      // El admin ve los empleados (rol USER) de su propia sucursal
      const miPerfil = await this.userRepository.findOne({
        where: { id: activeUser.sub },
        relations: { sucursal: true },
      });
      return this.userRepository.find({
        where: {
          role: Role.USER,
          sucursal: { idSucursal: miPerfil?.sucursal?.idSucursal },
        },
        relations: { sucursal: true, supervisor: true },
      });
    }

    // USER normal: solo su propio perfil
    return this.userRepository.find({
      where: { id: activeUser.sub },
      relations: { sucursal: true, supervisor: true },
    });
  }

  async findOne(id: number, activeUser: UserActiveInterface) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: { sucursal: true, supervisor: true },
    });

    if (!user) throw new NotFoundException('Usuario no encontrado');

    // Un USER solo puede verse a sí mismo
    if (activeUser.role === Role.USER && user.id !== activeUser.sub) {
      throw new ForbiddenException('No tienes acceso a este perfil');
    }

    return user;
  }

  async findMyProfile(activeUser: UserActiveInterface) {
    const user = await this.userRepository.findOne({
      where: { id: activeUser.sub },
      relations: { sucursal: true, supervisor: true },
    });
    if (!user) throw new NotFoundException('Perfil no encontrado');
    return user;
  }

  // SUPER_ADMIN asigna rol y perfil a cualquiera.
  // ADMIN puede completar el perfil de empleados de su sucursal.
  async updateProfile(
    id: number,
    dto: UpdateProfileDto,
    activeUser: UserActiveInterface,
  ) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: { sucursal: true },
    });

    if (!user) throw new NotFoundException('Usuario no encontrado');

    // Verificar permisos
    if (activeUser.role === Role.USER && user.id !== activeUser.sub) {
      throw new ForbiddenException('Solo puedes editar tu propio perfil');
    }

    if (activeUser.role === Role.ADMIN) {
      // Admin solo puede editar empleados de su sucursal
      const miPerfil = await this.userRepository.findOne({
        where: { id: activeUser.sub },
        relations: { sucursal: true },
      });
      if (user.sucursal?.idSucursal !== miPerfil?.sucursal?.idSucursal) {
        throw new ForbiddenException('Este usuario no pertenece a tu sucursal');
      }
    }

    // Mapear relaciones
    const updateData: any = { ...dto };
    if (dto.idSucursal) {
      updateData.sucursal = { idSucursal: dto.idSucursal };
      delete updateData.idSucursal;
    }
    if (dto.idSupervisor) {
      updateData.supervisor = { id: dto.idSupervisor };
      delete updateData.idSupervisor;
    }

    await this.userRepository.update(id, updateData);
    return this.userRepository.findOne({
      where: { id },
      relations: { sucursal: true, supervisor: true },
    });
  }

  async remove(id: number) {
    return this.userRepository.softDelete(id);
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.userRepository.update(id, updateUserDto);
  }
}
