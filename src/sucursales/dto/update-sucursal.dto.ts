import { PartialType } from '@nestjs/swagger';
import { CreateSucursalDto } from './create-sucursal.dto';
import { IsString, IsOptional, Length, Matches } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateSucursalDto extends PartialType(CreateSucursalDto) {
  @ApiPropertyOptional({
    description: 'Nombre de la sucursal',
    example: 'Sucursal Norte',
    minLength: 3,
    maxLength: 100,
  })
  @IsOptional()
  @IsString({ message: 'El nombre debe ser un texto' })
  @Length(3, 100, { message: 'El nombre debe tener entre 3 y 100 caracteres' })
  nombre?: string;

  @ApiPropertyOptional({
    description: 'Ciudad donde se encuentra la sucursal',
    example: 'Santa Cruz',
    minLength: 3,
    maxLength: 100,
  })
  @IsOptional()
  @IsString({ message: 'La ciudad debe ser un texto' })
  @Length(3, 100, { message: 'La ciudad debe tener entre 3 y 100 caracteres' })
  ciudad?: string;

  @ApiPropertyOptional({
    description: 'Dirección completa de la sucursal',
    example: 'Av. San Martín #456',
    minLength: 5,
    maxLength: 255,
  })
  @IsOptional()
  @IsString({ message: 'La dirección debe ser un texto' })
  @Length(5, 255, {
    message: 'La dirección debe tener entre 5 y 255 caracteres',
  })
  direccion?: string;

  @ApiPropertyOptional({
    description: 'Número de teléfono de la sucursal',
    example: '3-7654321',
    minLength: 7,
    maxLength: 20,
  })
  @IsOptional()
  @IsString({ message: 'El teléfono debe ser un texto' })
  @Length(7, 20, { message: 'El teléfono debe tener entre 7 y 20 caracteres' })
  @Matches(/^[0-9+-]+$/, {
    message: 'El teléfono solo puede contener números, + y -',
  })
  telefono?: string;
}
