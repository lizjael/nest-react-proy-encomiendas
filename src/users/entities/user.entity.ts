// src/users/entities/user.entity.ts
import { Role } from '../../common/enums/rol.enum';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  UpdateDateColumn,
} from 'typeorm';
import { Sucursal } from '../../sucursales/entities/sucursal.entity';
import { Encomienda } from '../../encomiendas/entities/encomienda.entity';

@Entity('users')
export class User {
  @Column({ primary: true, generated: true })
  id: number;

  @Column()
  name: string;

  @Column({ unique: true, nullable: false })
  email: string;

  @Column({ nullable: false, select: false })
  password: string;

  @Column({ type: 'enum', enum: Role, default: Role.USER })
  role: Role;

  @Column({ type: 'varchar', length: 10, default: 'Activo' })
  estado: string;
  // ── Campos de perfil (opcionales al registrar, se completan al crear empleado/admin) ──
  @Column({ length: 100, nullable: true })
  nombres: string;

  @Column({ length: 100, nullable: true })
  apellidos: string;

  @Column({ length: 20, nullable: true, unique: true })
  ci: string;

  @Column({ length: 20, nullable: true })
  telefono: string;

  @Column({ type: 'time', nullable: true })
  horaEntrada: string;

  @Column({ type: 'time', nullable: true })
  horaSalida: string;

  @Column({ length: 50, nullable: true })
  turno: string;

  @Column({ type: 'date', nullable: true })
  fechaContratacion: string;

  // ── Relación con sucursal (aplica a empleados y admins) ──
  @Column({ name: 'idSucursal', type: 'int', nullable: true })
  idSucursal: number;

  @ManyToOne(() => Sucursal, (sucursal) => sucursal.users, { nullable: true })
  @JoinColumn({ name: 'idSucursal' })
  sucursal: Sucursal;

  // ── Supervisor: el admin que creó/supervisa a este empleado ──
  @Column({ name: 'idSupervisor', type: 'int', nullable: true })
  idSupervisor: number;

  @ManyToOne(() => User, (user) => user.empleadosSupervivados, {
    nullable: true,
  })
  @JoinColumn({ name: 'idSupervisor' })
  supervisor: User;

  @OneToMany(() => User, (user) => user.supervisor)
  empleadosSupervivados: User[];

  // ── Relación con encomiendas (solo empleados) ──
  @OneToMany(() => Encomienda, (encomienda) => encomienda.empleado)
  encomiendas: Encomienda[];

  @CreateDateColumn()
  creadoEn: Date;

  @UpdateDateColumn()
  actualizadoEn: Date;

  @DeleteDateColumn()
  eliminadoEn: Date;
}
