import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateEncomiendaDto } from './dto/create-encomienda.dto';
import { UpdateEncomiendaDto } from './dto/update-encomienda.dto';
import { Encomienda } from './entities/encomienda.entity';
import { Cliente } from '../clientes/entities/cliente.entity';
import { Consignatario } from '../consignatarios/entities/consignatario.entity';
import { User } from '../users/entities/user.entity';
import { Sucursal } from '../sucursales/entities/sucursal.entity';
import { UserActiveInterface } from '../common/interfaces/user-active.interface';
import { Role } from '../common/enums/rol.enum';

@Injectable()
export class EncomiendasService {
  constructor(
    @InjectRepository(Encomienda)
    private readonly encomiendaRepository: Repository<Encomienda>,

    @InjectRepository(Cliente)
    private readonly clienteRepository: Repository<Cliente>,

    @InjectRepository(Consignatario)
    private readonly consignatarioRepository: Repository<Consignatario>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Sucursal)
    private readonly sucursalRepository: Repository<Sucursal>,
  ) {}

  async create(
    createEncomiendaDto: CreateEncomiendaDto,
    user: UserActiveInterface,
  ) {
    const cliente = await this.clienteRepository.findOne({
      where: { idCliente: createEncomiendaDto.idCliente },
    });
    if (!cliente) throw new BadRequestException('Cliente no encontrado');

    const consignatario = await this.consignatarioRepository.findOne({
      where: { idConsignatario: createEncomiendaDto.idConsignatario },
    });
    if (!consignatario)
      throw new BadRequestException('Consignatario no encontrado');

    const empleado = await this.userRepository.findOne({
      where: { id: createEncomiendaDto.idEmpleado },
      relations: { sucursal: true },
    });
    if (!empleado) throw new BadRequestException('Empleado no encontrado');

    const sucursalOrigen = await this.sucursalRepository.findOne({
      where: { idSucursal: createEncomiendaDto.idSucursalOrigen },
    });
    if (!sucursalOrigen)
      throw new BadRequestException('Sucursal de origen no encontrada');

    const sucursalDestino = await this.sucursalRepository.findOne({
      where: { idSucursal: createEncomiendaDto.idSucursalDestino },
    });
    if (!sucursalDestino)
      throw new BadRequestException('Sucursal de destino no encontrada');

    const guiaExistente = await this.encomiendaRepository.findOne({
      where: { nroGuia: createEncomiendaDto.nroGuia },
    });
    if (guiaExistente)
      throw new BadRequestException('El número de guía ya existe');

    if (user.role === Role.ADMIN) {
      const miPerfil = await this.getUserProfile(user.sub);
      if (
        miPerfil.sucursal?.idSucursal !== createEncomiendaDto.idSucursalOrigen
      ) {
        throw new ForbiddenException(
          'Solo puedes crear encomiendas desde tu sucursal',
        );
      }
    }

    const nuevaEncomienda = this.encomiendaRepository.create({
      nroGuia: createEncomiendaDto.nroGuia,
      fechaEmision: createEncomiendaDto.fechaEmision,
      fechaLimiteEntrega: createEncomiendaDto.fechaLimiteEntrega,
      observaciones: createEncomiendaDto.observaciones,
      costoTotal: createEncomiendaDto.costoTotal,
      estadoEntrega: createEncomiendaDto.estadoEntrega || 'PENDIENTE',
      estadoPago: createEncomiendaDto.estadoPago || 'PENDIENTE',
      cliente: { idCliente: createEncomiendaDto.idCliente },
      consignatario: { idConsignatario: createEncomiendaDto.idConsignatario },
      empleado: { id: createEncomiendaDto.idEmpleado },
      sucursalOrigen: { idSucursal: createEncomiendaDto.idSucursalOrigen },
      sucursalDestino: { idSucursal: createEncomiendaDto.idSucursalDestino },
    });

    return this.encomiendaRepository.save(nuevaEncomienda);
  }

  async findAll(user: UserActiveInterface) {
    if (user.role === Role.SUPER_ADMIN) {
      return this.encomiendaRepository.find({
        relations: {
          cliente: true,
          consignatario: true,
          empleado: true,
          sucursalOrigen: true,
          sucursalDestino: true,
        },
      });
    }

    if (user.role === Role.ADMIN) {
      const miPerfil = await this.getUserProfile(user.sub);
      const sucursalId = miPerfil.sucursal?.idSucursal;
      return this.encomiendaRepository.find({
        where: [
          { sucursalOrigen: { idSucursal: sucursalId } },
          { sucursalDestino: { idSucursal: sucursalId } },
        ],
        relations: {
          cliente: true,
          consignatario: true,
          empleado: true,
          sucursalOrigen: true,
          sucursalDestino: true,
        },
      });
    }

    // USER (empleado): solo ve las encomiendas que él registró
    return this.encomiendaRepository.find({
      where: { empleado: { id: user.sub } },
      relations: {
        cliente: true,
        consignatario: true,
        empleado: true,
        sucursalOrigen: true,
        sucursalDestino: true,
      },
    });
  }

  async findOne(id: number, user: UserActiveInterface) {
    const encomienda = await this.encomiendaRepository.findOne({
      where: { idEncomienda: id },
      relations: {
        cliente: true,
        consignatario: true,
        empleado: true,
        sucursalOrigen: true,
        sucursalDestino: true,
      },
    });

    if (!encomienda) throw new NotFoundException('Encomienda no encontrada');

    await this.validateOwnership(encomienda, user);
    return encomienda;
  }

  async update(
    id: number,
    updateEncomiendaDto: UpdateEncomiendaDto,
    user: UserActiveInterface,
  ) {
    await this.findOne(id, user);

    if (updateEncomiendaDto.nroGuia) {
      const guiaExistente = await this.encomiendaRepository.findOne({
        where: { nroGuia: updateEncomiendaDto.nroGuia },
      });
      if (guiaExistente && guiaExistente.idEncomienda !== id) {
        throw new BadRequestException('El número de guía ya existe');
      }
    }

    const updateData: any = { ...updateEncomiendaDto };
    if (updateEncomiendaDto.idCliente)
      updateData.cliente = { idCliente: updateEncomiendaDto.idCliente };
    if (updateEncomiendaDto.idConsignatario)
      updateData.consignatario = {
        idConsignatario: updateEncomiendaDto.idConsignatario,
      };
    if (updateEncomiendaDto.idEmpleado)
      updateData.empleado = { id: updateEncomiendaDto.idEmpleado };
    if (updateEncomiendaDto.idSucursalOrigen)
      updateData.sucursalOrigen = {
        idSucursal: updateEncomiendaDto.idSucursalOrigen,
      };
    if (updateEncomiendaDto.idSucursalDestino)
      updateData.sucursalDestino = {
        idSucursal: updateEncomiendaDto.idSucursalDestino,
      };

    await this.encomiendaRepository.update(id, updateData);
    return this.findOne(id, user);
  }

  async remove(id: number, user: UserActiveInterface) {
    await this.findOne(id, user);
    return this.encomiendaRepository.softDelete(id);
  }

  async findByGuia(nroGuia: string, user: UserActiveInterface) {
    const encomienda = await this.encomiendaRepository.findOne({
      where: { nroGuia },
      relations: {
        cliente: true,
        consignatario: true,
        empleado: true,
        sucursalOrigen: true,
        sucursalDestino: true,
      },
    });

    if (!encomienda) throw new NotFoundException('Encomienda no encontrada');

    await this.validateOwnership(encomienda, user);
    return encomienda;
  }

  private async validateOwnership(
    encomienda: Encomienda,
    user: UserActiveInterface,
  ) {
    if (user.role === Role.SUPER_ADMIN) return;

    if (user.role === Role.ADMIN) {
      const miPerfil = await this.getUserProfile(user.sub);
      const sucursalId = miPerfil.sucursal?.idSucursal;
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

  // Obtiene el perfil del user logueado con su sucursal
  private async getUserProfile(userId: number): Promise<User> {
    const userProfile = await this.userRepository.findOne({
      where: { id: userId },
      relations: { sucursal: true },
    });

    if (!userProfile) {
      throw new ForbiddenException('No se encontró tu perfil de usuario');
    }

    return userProfile;
  }
}
