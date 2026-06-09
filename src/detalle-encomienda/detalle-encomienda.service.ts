import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateDetalleEncomiendaDto } from './dto/create-detalle-encomienda.dto';
import { UpdateDetalleEncomiendaDto } from './dto/update-detalle-encomienda.dto';
import { DetalleEncomienda } from './entities/detalle-encomienda.entity';
import { Encomienda } from '../encomiendas/entities/encomienda.entity';
import { User } from '../users/entities/user.entity';
import { UserActiveInterface } from '../common/interfaces/user-active.interface';
import { Role } from '../common/enums/rol.enum';

@Injectable()
export class DetalleEncomiendasService {
  constructor(
    @InjectRepository(DetalleEncomienda)
    private readonly detalleRepository: Repository<DetalleEncomienda>,

    @InjectRepository(Encomienda)
    private readonly encomiendaRepository: Repository<Encomienda>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(
    createDetalleDto: CreateDetalleEncomiendaDto,
    user: UserActiveInterface,
  ) {
    const encomienda = await this.encomiendaRepository.findOne({
      where: { idEncomienda: createDetalleDto.idEncomienda },
      relations: { sucursalOrigen: true, sucursalDestino: true },
    });

    if (!encomienda) throw new NotFoundException('Encomienda no encontrada');

    await this.validateEncomiendaAccess(encomienda, user);

    const nuevoDetalle = this.detalleRepository.create({
      descripcion: createDetalleDto.descripcion,
      cantidad: createDetalleDto.cantidad,
      pesoKg: createDetalleDto.pesoKg,
      costoFlete: createDetalleDto.costoFlete,
      encomienda: { idEncomienda: createDetalleDto.idEncomienda },
    });

    const detalleGuardado = await this.detalleRepository.save(nuevoDetalle);
    await this.actualizarCostoTotalEncomienda(createDetalleDto.idEncomienda);
    return detalleGuardado;
  }

  async findAll(user: UserActiveInterface) {
    const query = this.detalleRepository
      .createQueryBuilder('detalle')
      .leftJoinAndSelect('detalle.encomienda', 'encomienda')
      .leftJoinAndSelect('encomienda.sucursalOrigen', 'sucursalOrigen')
      .leftJoinAndSelect('encomienda.sucursalDestino', 'sucursalDestino');

    if (user.role === Role.SUPER_ADMIN) return query.getMany();

    if (user.role === Role.ADMIN) {
      const miPerfil = await this.getUserProfile(user.sub);
      const sucursalId = miPerfil.sucursal?.idSucursal;
      if (!sucursalId) return [];
      return query
        .where(
          'encomienda.idSucursalOrigen = :sucursalId OR encomienda.idSucursalDestino = :sucursalId',
          { sucursalId },
        )
        .getMany();
    }

    if (user.role === Role.USER) {
      return query
        .where('encomienda.idEmpleado = :userId', { userId: user.sub })
        .getMany();
    }

    return [];
  }

  async findAllByEncomienda(idEncomienda: number, user: UserActiveInterface) {
    const encomienda = await this.encomiendaRepository.findOne({
      where: { idEncomienda },
      relations: { sucursalOrigen: true, sucursalDestino: true },
    });

    if (!encomienda) throw new NotFoundException('Encomienda no encontrada');

    await this.validateEncomiendaAccess(encomienda, user);

    return this.detalleRepository.find({
      where: { encomienda: { idEncomienda } },
      relations: { encomienda: true },
    });
  }

  async findOne(id: number, user: UserActiveInterface) {
    const detalle = await this.detalleRepository.findOne({
      where: { idDetalle: id },
      relations: {
        encomienda: {
          sucursalOrigen: true,
          sucursalDestino: true,
        },
      },
    });

    if (!detalle)
      throw new NotFoundException('Detalle de encomienda no encontrado');

    await this.validateAccess(detalle, user);
    return detalle;
  }

  async update(
    id: number,
    updateDetalleDto: UpdateDetalleEncomiendaDto,
    user: UserActiveInterface,
  ) {
    const detalle = await this.findOne(id, user);

    if (
      updateDetalleDto.idEncomienda &&
      updateDetalleDto.idEncomienda !== detalle.idEncomienda
    ) {
      const nuevaEncomienda = await this.encomiendaRepository.findOne({
        where: { idEncomienda: updateDetalleDto.idEncomienda },
        relations: { sucursalOrigen: true, sucursalDestino: true },
      });
      if (!nuevaEncomienda)
        throw new NotFoundException('Encomienda no encontrada');
      await this.validateEncomiendaAccess(nuevaEncomienda, user);
    }

    await this.detalleRepository.update(id, updateDetalleDto);
    const detalleActualizado = await this.findOne(id, user);
    await this.actualizarCostoTotalEncomienda(detalleActualizado.idEncomienda);
    return detalleActualizado;
  }

  async remove(id: number, user: UserActiveInterface) {
    const detalle = await this.findOne(id, user);

    if (user.role !== Role.SUPER_ADMIN) {
      throw new ForbiddenException(
        'Solo SUPER_ADMIN puede eliminar detalles de encomienda',
      );
    }

    await this.detalleRepository.softDelete(id);
    await this.actualizarCostoTotalEncomienda(detalle.idEncomienda);
    return { message: 'Detalle eliminado correctamente' };
  }

  // ── Privados ──

  private async actualizarCostoTotalEncomienda(idEncomienda: number) {
    const detalles = await this.detalleRepository.find({
      where: { encomienda: { idEncomienda } },
    });

    const costoTotal = detalles.reduce(
      (sum, detalle) => sum + Number(detalle.costoFlete),
      0,
    );

    await this.encomiendaRepository.update(idEncomienda, { costoTotal });
  }

  private async validateEncomiendaAccess(
    encomienda: Encomienda,
    user: UserActiveInterface,
  ) {
    if (user.role === Role.SUPER_ADMIN) return;

    if (user.role === Role.ADMIN) {
      const miPerfil = await this.getUserProfile(user.sub);
      const sucursalId = miPerfil.sucursal?.idSucursal;
      if (!sucursalId)
        throw new ForbiddenException('No tienes sucursal asignada');
      if (
        encomienda.sucursalOrigen?.idSucursal !== sucursalId &&
        encomienda.sucursalDestino?.idSucursal !== sucursalId
      ) {
        throw new ForbiddenException(
          'No tienes permiso para acceder a esta encomienda',
        );
      }
      return;
    }

    if (user.role === Role.USER) {
      if (encomienda.idEmpleado !== user.sub) {
        throw new ForbiddenException(
          'Solo puedes acceder a tus propias encomiendas',
        );
      }
      return;
    }
  }

  private async validateAccess(
    detalle: DetalleEncomienda,
    user: UserActiveInterface,
  ) {
    if (user.role === Role.SUPER_ADMIN) return;

    if (user.role === Role.ADMIN) {
      const miPerfil = await this.getUserProfile(user.sub);
      const sucursalId = miPerfil.sucursal?.idSucursal;
      if (!sucursalId)
        throw new ForbiddenException('No tienes sucursal asignada');
      if (
        detalle.encomienda.sucursalOrigen?.idSucursal !== sucursalId &&
        detalle.encomienda.sucursalDestino?.idSucursal !== sucursalId
      ) {
        throw new ForbiddenException(
          'No tienes permiso para acceder a este detalle',
        );
      }
      return;
    }

    if (user.role === Role.USER) {
      if (detalle.encomienda.idEmpleado !== user.sub) {
        throw new ForbiddenException(
          'Solo puedes acceder a detalles de tus propias encomiendas',
        );
      }
      return;
    }
  }

  private async getUserProfile(userId: number): Promise<User> {
    const userProfile = await this.userRepository.findOne({
      where: { id: userId },
      relations: { sucursal: true },
    });
    if (!userProfile) throw new ForbiddenException('No se encontró tu perfil');
    return userProfile;
  }
}
