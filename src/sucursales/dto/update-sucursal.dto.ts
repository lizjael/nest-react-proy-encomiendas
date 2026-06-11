import { PartialType } from '@nestjs/swagger';
import { CreateSucursalDto } from './create-sucursal.dto';
import {
  IsString,
  IsOptional,
  IsBoolean,
  Length,
  Matches,
  IsIn,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateSucursalDto extends PartialType(CreateSucursalDto) {
  @IsOptional()
  @IsString()
  @Length(3, 100)
  nombre?: string;

  @IsOptional()
  @IsString()
  @Length(3, 100)
  ciudad?: string;

  @IsOptional()
  @IsString()
  @Length(5, 255)
  direccion?: string;

  @IsOptional()
  @IsString()
  @Length(7, 20)
  @Matches(/^[0-9+-]+$/)
  telefono?: string;

  // REEMPLAZA el campo activo por:
  @IsOptional()
  @IsString()
  @IsIn(['Activo', 'Inactivo'])
  estado?: string;
}
