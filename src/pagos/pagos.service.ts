import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePagoDto } from './dto/create-pago.dto';
import { UpdatePagoDto } from './dto/update-pago.dto';
import { Pago } from './entities/pago.entity';
import { Encomienda } from '../encomiendas/entities/encomienda.entity';
import { User } from '../users/entities/user.entity';
import { UserActiveInterface } from '../common/interfaces/user-active.interface';
import { Role } from '../common/enums/rol.enum';
import { MetodoPagoEnum } from '../common/enums/metodos-pago.enum';

@Injectable()
export class PagosService {
  constructor(
    @InjectRepository(Pago)
    private readonly pagoRepository: Repository<Pago>,

    @InjectRepository(Encomienda)
    private readonly encomiendaRepository: Repository<Encomienda>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAllMetodosPago() {
    return Object.values(MetodoPagoEnum);
  }

  async findMetodoPagoByNombre(nombre: string) {
    const metodos = Object.values(MetodoPagoEnum);
    const metodo = metodos.find((m) => m === nombre);
    if (!metodo)
      throw new NotFoundException(`Método de pago ${nombre} no encontrado`);
    return metodo;
  }

  async create(createPagoDto: CreatePagoDto, user: UserActiveInterface) {
    const encomienda = await this.encomiendaRepository.findOne({
      where: { idEncomienda: createPagoDto.idEncomienda },
      relations: { sucursalOrigen: true, sucursalDestino: true },
    });

    if (!encomienda) throw new NotFoundException('Encomienda no encontrada');

    if (user.role === Role.ADMIN) {
      const miPerfil = await this.getUserProfile(user.sub);
      const sucursalId = miPerfil.sucursal?.idSucursal;
      if (!sucursalId)
        throw new ForbiddenException('Tu perfil no tiene sucursal asignada');
      if (
        encomienda.sucursalOrigen?.idSucursal !== sucursalId &&
        encomienda.sucursalDestino?.idSucursal !== sucursalId
      ) {
        throw new ForbiddenException(
          'No tienes permiso para registrar pagos de esta encomienda',
        );
      }
    }

    const pagosRealizados = await this.pagoRepository.find({
      where: {
        encomienda: { idEncomienda: createPagoDto.idEncomienda },
        estado: 'COMPLETADO',
      },
    });

    const totalPagado = pagosRealizados.reduce(
      (sum, p) => sum + Number(p.monto),
      0,
    );
    const nuevoTotal = totalPagado + createPagoDto.monto;
    const costoTotal = Number(encomienda.costoTotal);

    if (nuevoTotal > costoTotal) {
      throw new BadRequestException(
        `El monto excede el costo total pendiente. Pendiente: ${costoTotal - totalPagado}`,
      );
    }

    const nuevoPago = this.pagoRepository.create({
      monto: createPagoDto.monto,
      fecha: createPagoDto.fecha,
      referencia: createPagoDto.referencia,
      comprobanteUrl: createPagoDto.comprobanteUrl,
      estado: createPagoDto.estado || 'PENDIENTE',
      metodoPago: createPagoDto.metodoPago,
      encomienda: { idEncomienda: createPagoDto.idEncomienda },
    });

    const pagoGuardado = await this.pagoRepository.save(nuevoPago);
    await this.actualizarEstadoPagoEncomienda(createPagoDto.idEncomienda);
    return pagoGuardado;
  }

  async findAll(user: UserActiveInterface) {
    const query = this.pagoRepository
      .createQueryBuilder('pago')
      .leftJoinAndSelect('pago.encomienda', 'encomienda')
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

  async findOne(id: number, user: UserActiveInterface) {
    const pago = await this.pagoRepository.findOne({
      where: { idPago: id },
      relations: {
        encomienda: { sucursalOrigen: true, sucursalDestino: true },
      },
    });

    if (!pago) throw new NotFoundException('Pago no encontrado');

    await this.validateOwnership(pago, user);
    return pago;
  }

  async update(
    id: number,
    updatePagoDto: UpdatePagoDto,
    user: UserActiveInterface,
  ) {
    const pago = await this.findOne(id, user);

    if (updatePagoDto.monto && updatePagoDto.monto !== pago.monto) {
      const encomienda = await this.encomiendaRepository.findOne({
        where: { idEncomienda: pago.idEncomienda },
      });
      if (!encomienda) throw new NotFoundException('Encomienda no encontrada');

      const otrosPagos = await this.pagoRepository.find({
        where: {
          encomienda: { idEncomienda: pago.idEncomienda },
          estado: 'COMPLETADO',
        },
      });

      const totalOtros = otrosPagos
        .filter((p) => p.idPago !== id)
        .reduce((sum, p) => sum + Number(p.monto), 0);

      if (totalOtros + updatePagoDto.monto > Number(encomienda.costoTotal)) {
        throw new BadRequestException(
          'El nuevo monto excede el costo total de la encomienda',
        );
      }
    }

    await this.pagoRepository.update(id, updatePagoDto);
    const pagoActualizado = await this.findOne(id, user);
    await this.actualizarEstadoPagoEncomienda(pagoActualizado.idEncomienda);
    return pagoActualizado;
  }

  async remove(id: number, user: UserActiveInterface) {
    const pago = await this.findOne(id, user);
    if (user.role !== Role.SUPER_ADMIN) {
      throw new ForbiddenException('Solo SUPER_ADMIN puede eliminar pagos');
    }
    await this.pagoRepository.softDelete(id);
    await this.actualizarEstadoPagoEncomienda(pago.idEncomienda);
    return { message: 'Pago eliminado correctamente' };
  }

  // ── Privados ──

  private async actualizarEstadoPagoEncomienda(idEncomienda: number) {
    const encomienda = await this.encomiendaRepository.findOne({
      where: { idEncomienda },
    });
    if (!encomienda) return;

    const pagos = await this.pagoRepository.find({
      where: { encomienda: { idEncomienda }, estado: 'COMPLETADO' },
    });

    const totalPagado = pagos.reduce((sum, p) => sum + Number(p.monto), 0);
    const costoTotal = Number(encomienda.costoTotal);

    let estadoPago: string;
    if (totalPagado >= costoTotal) estadoPago = 'PAGADO';
    else if (totalPagado > 0) estadoPago = 'PARCIAL';
    else estadoPago = 'PENDIENTE';

    await this.encomiendaRepository.update(idEncomienda, { estadoPago });
  }

  private async validateOwnership(pago: Pago, user: UserActiveInterface) {
    if (user.role === Role.SUPER_ADMIN) return;

    if (user.role === Role.ADMIN) {
      const miPerfil = await this.getUserProfile(user.sub);
      const sucursalId = miPerfil.sucursal?.idSucursal;
      if (!sucursalId)
        throw new ForbiddenException('No tienes sucursal asignada');
      if (
        pago.encomienda.sucursalOrigen?.idSucursal !== sucursalId &&
        pago.encomienda.sucursalDestino?.idSucursal !== sucursalId
      ) {
        throw new ForbiddenException(
          'No tienes permiso para acceder a este pago',
        );
      }
      return;
    }

    if (user.role === Role.USER) {
      if (pago.encomienda.idEmpleado !== user.sub) {
        throw new ForbiddenException(
          'Solo puedes acceder a pagos de tus propias encomiendas',
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
