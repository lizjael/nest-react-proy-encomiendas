import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Cliente } from '../../clientes/entities/cliente.entity';
import { Consignatario } from '../../consignatarios/entities/consignatario.entity';
import { User } from '../../users/entities/user.entity';
import { Sucursal } from '../../sucursales/entities/sucursal.entity';
import { Pago } from 'src/pagos/entities/pago.entity';
import { DetalleEncomienda } from 'src/detalle-encomienda/entities/detalle-encomienda.entity';

@Entity('encomiendas')
export class Encomienda {
  @PrimaryGeneratedColumn()
  idEncomienda: number;

  @Column({ unique: true, length: 50 })
  nroGuia: string;

  @Column({ type: 'date', name: 'fecha_emision' })
  fechaEmision: Date;

  @Column({ type: 'date', name: 'fecha_limite_entrega' })
  fechaLimiteEntrega: Date;

  @Column({ type: 'text', nullable: true })
  observaciones: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    name: 'costo_total',
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value),
    },
  })
  costoTotal: number;

  @Column({ length: 50, name: 'estado_entrega', default: 'PENDIENTE' })
  estadoEntrega: string;

  @Column({ length: 50, name: 'estado_pago', default: 'PENDIENTE' })
  estadoPago: string;

  // Relación con Cliente
  @ManyToOne(() => Cliente, (cliente) => cliente.encomiendas)
  @JoinColumn({ name: 'id_cliente' })
  cliente: Cliente;

  @Column({ name: 'id_cliente' })
  idCliente: number;

  // Relación con Consignatario
  @ManyToOne(() => Consignatario, (consignatario) => consignatario.encomiendas)
  @JoinColumn({ name: 'id_consignatario' })
  consignatario: Consignatario;

  @Column({ name: 'id_consignatario' })
  idConsignatario: number;

  // Relación con User (empleado que registra la encomienda)
  @ManyToOne(() => User, (user) => user.encomiendas)
  @JoinColumn({ name: 'id_empleado' })
  empleado: User;

  @Column({ name: 'id_empleado' })
  idEmpleado: number;

  // Relación con Sucursal Origen
  @ManyToOne(() => Sucursal, (sucursal) => sucursal.encomiendasOrigen)
  @JoinColumn({ name: 'id_sucursal_origen' })
  sucursalOrigen: Sucursal;

  @Column({ name: 'id_sucursal_origen' })
  idSucursalOrigen: number;

  // Relación con Sucursal Destino
  @ManyToOne(() => Sucursal, (sucursal) => sucursal.encomiendasDestino)
  @JoinColumn({ name: 'id_sucursal_destino' })
  sucursalDestino: Sucursal;

  @Column({ name: 'id_sucursal_destino' })
  idSucursalDestino: number;

  @CreateDateColumn({ name: 'creado_en' })
  creadoEn: Date;

  @UpdateDateColumn({ name: 'actualizado_en' })
  actualizadoEn: Date;

  @DeleteDateColumn({ name: 'eliminado_en' })
  eliminadoEn: Date;

  @OneToMany(() => Pago, (pago) => pago.encomienda)
  pagos: Pago[];

  @OneToMany(() => DetalleEncomienda, (detalle) => detalle.encomienda)
  detalles: DetalleEncomienda[];
}
