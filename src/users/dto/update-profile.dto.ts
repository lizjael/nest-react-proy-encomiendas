import {
  IsOptional,
  IsString,
  IsNumber,
  IsDateString,
  IsBoolean,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  nombres?: string;

  @IsOptional()
  @IsString()
  apellidos?: string;

  @IsOptional()
  @IsString()
  ci?: string;

  @IsOptional()
  @IsString()
  telefono?: string;

  @IsOptional()
  @IsString()
  horaEntrada?: string;

  @IsOptional()
  @IsString()
  horaSalida?: string;

  @IsOptional()
  @IsString()
  turno?: string;

  @IsOptional()
  @Transform(({ value }) => (value === '' ? undefined : value))
  @IsDateString()
  fechaContratacion?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  idSucursal?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  idSupervisor?: number;

  // ✅ ESTE ES EL QUE FALTA — agrégalo
  @IsOptional()
  @IsBoolean()
  activo?: boolean;
}
