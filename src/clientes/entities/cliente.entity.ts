import { Encomienda } from 'src/encomiendas/entities/encomienda.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  DeleteDateColumn,
  UpdateDateColumn,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
@Entity()
export class Cliente {
  @PrimaryGeneratedColumn()
  idCliente: number;

  @Column({ length: 50 })
  tipoCliente: string;

  @Column({ length: 200, name: 'nombre_razon_social' })
  nombreRazonSocial: string;

  @Column({ length: 20, nullable: true })
  ci: string;

  @Column({ length: 20, nullable: true })
  nit: string;

  @Column({ length: 20 })
  telefono: string;

  @Column({ length: 255 })
  direccion: string;

  @CreateDateColumn()
  creadoEn: Date;

  @UpdateDateColumn()
  actualizadoEn: Date;

  @DeleteDateColumn()
  eliminadoEn: Date;

  // Relación OneToMany con Encomienda
  @OneToMany(() => Encomienda, (encomienda) => encomienda.cliente)
  encomiendas: Encomienda[];
}
