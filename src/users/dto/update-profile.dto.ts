import { IsOptional, IsString, IsNumber, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';

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
  @IsDateString()
  fechaContratacion?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  idSucursal?: number;

  // El service lo referencia — necesita estar en el DTO
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  idSupervisor?: number;
}
