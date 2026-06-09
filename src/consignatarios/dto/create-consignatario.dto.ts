import { IsString, IsNotEmpty, Length, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateConsignatarioDto {
  @ApiProperty({
    description: 'Nombres completos del consignatario',
    example: 'Juan Carlos Pérez Gómez',
    minLength: 3,
    maxLength: 200,
  })
  @IsString({ message: 'Los nombres deben ser un texto' })
  @IsNotEmpty({ message: 'Los nombres son obligatorios' })
  @Length(3, 200, {
    message: 'Los nombres deben tener entre 3 y 200 caracteres',
  })
  nombres: string;

  @ApiProperty({
    description: 'Número de teléfono del consignatario',
    example: '76543210',
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
