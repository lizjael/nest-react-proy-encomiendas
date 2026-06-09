// pagos/entities/pago.entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Encomienda } from '../../encomiendas/entities/encomienda.entity';
import { MetodoPagoEnum } from '../../common/enums/metodos-pago.enum';
@Entity('pagos')
export class Pago {
  @PrimaryGeneratedColumn()
  idPago: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  monto: number;

  @Column({ type: 'date' })
  fecha: Date;

  @Column({ length: 100, nullable: true })
  referencia: string;

  @Column({ length: 255, nullable: true })
  comprobanteUrl: string;

  @Column({
    type: 'enum',
    enum: MetodoPagoEnum,
    default: MetodoPagoEnum.EFECTIVO,
  })
  metodoPago: MetodoPagoEnum;

  @Column({
    type: 'enum',
    enum: ['COMPLETADO', 'PENDIENTE', 'RECHAZADO', 'ANULADO'],
    default: 'PENDIENTE',
  })
  estado: string;

  // Relación con Encomienda
  @ManyToOne(() => Encomienda, (encomienda) => encomienda.pagos)
  @JoinColumn({ name: 'idEncomienda' })
  encomienda: Encomienda;

  @Column({ name: 'idEncomienda' })
  idEncomienda: number;

  @CreateDateColumn()
  creadoEn: Date;

  @UpdateDateColumn()
  actualizadoEn: Date;

  @DeleteDateColumn()
  eliminadoEn: Date;
}
