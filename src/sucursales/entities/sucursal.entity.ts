import { User } from 'src/users/entities/user.entity';
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
export class Sucursal {
  @PrimaryGeneratedColumn()
  idSucursal: number;

  @Column({ length: 100 })
  nombre: string;

  @Column({ length: 100 })
  ciudad: string;

  @Column({ length: 255 })
  direccion: string;

  @Column({ length: 20 })
  telefono: string;

  @Column({ type: 'varchar', length: 10, default: 'Activo' })
  estado: string;

  @CreateDateColumn()
  creadoEn: Date;

  @UpdateDateColumn()
  actualizadoEn: Date;

  @DeleteDateColumn()
  eliminadoEn: Date;

  // Todos los users (admins y empleados) que pertenecen a esta sucursal
  @OneToMany(() => User, (user) => user.sucursal)
  users: User[];

  @OneToMany(() => Encomienda, (encomienda) => encomienda.sucursalOrigen)
  encomiendasOrigen: Encomienda[];

  @OneToMany(() => Encomienda, (encomienda) => encomienda.sucursalDestino)
  encomiendasDestino: Encomienda[];
}
