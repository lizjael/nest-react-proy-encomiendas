import { Encomienda } from 'src/encomiendas/entities/encomienda.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';

@Entity('consignatario')
export class Consignatario {
  @PrimaryGeneratedColumn()
  idConsignatario: number;

  @Column({ type: 'varchar', length: 100 })
  nombres: string;

  @Column({ type: 'varchar', length: 20 })
  telefono: string;

  @CreateDateColumn()
  creadoEn: Date;

  @UpdateDateColumn()
  actualizadoEn: Date;

  @DeleteDateColumn()
  eliminadoEn: Date;

  //relacion con encomienda
  @OneToMany(() => Encomienda, (encomienda) => encomienda.consignatario)
  encomiendas: Encomienda[];
}
