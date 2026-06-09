import { IsString, IsNotEmpty, Length, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSucursalDto {
  @ApiProperty({
    description: 'Nombre de la sucursal',
    example: 'Sucursal Centro',
    minLength: 3,
    maxLength: 100,
  })
  @IsString({ message: 'El nombre debe ser un texto' })
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @Length(3, 100, { message: 'El nombre debe tener entre 3 y 100 caracteres' })
  nombre: string;

  @ApiProperty({
    description: 'Ciudad donde se encuentra la sucursal',
    example: 'Cochabamba',
    minLength: 3,
    maxLength: 100,
  })
  @IsString({ message: 'La ciudad debe ser un texto' })
  @IsNotEmpty({ message: 'La ciudad es obligatoria' })
  @Length(3, 100, { message: 'La ciudad debe tener entre 3 y 100 caracteres' })
  ciudad: string;

  @ApiProperty({
    description: 'Dirección completa de la sucursal',
    example: 'Av. América #123, entre calles 1 y 2',
    minLength: 5,
    maxLength: 255,
  })
  @IsString({ message: 'La dirección debe ser un texto' })
  @IsNotEmpty({ message: 'La dirección es obligatoria' })
  @Length(5, 255, {
    message: 'La dirección debe tener entre 5 y 255 caracteres',
  })
  direccion: string;

  @ApiProperty({
    description: 'Número de teléfono de la sucursal',
    example: '4-1234567',
    minLength: 7,
    maxLength: 20,
  })
  @IsString({ message: 'El teléfono debe ser un texto' })
  @IsNotEmpty({ message: 'El teléfono es obligatorio' })
  @Length(7, 20, { message: 'El teléfono debe tener entre 7 y 20 caracteres' })
  @Matches(/^[0-9+-]+$/, {
    message: 'El teléfono solo puede contener números, + y -',
  })
  telefono: string;
}
