// detalle-encomiendas/entities/detalle-encomienda.entity.ts
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

@Entity('detalle_encomiendas')
export class DetalleEncomienda {
  @PrimaryGeneratedColumn()
  idDetalle: number;

  @Column({ type: 'text' })
  descripcion: string;

  @Column({ type: 'int' })
  cantidad: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  pesoKg: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  costoFlete: number;

  // Relación con Encomienda
  @ManyToOne(() => Encomienda, (encomienda) => encomienda.detalles)
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
