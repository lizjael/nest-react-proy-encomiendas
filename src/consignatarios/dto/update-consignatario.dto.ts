import { PartialType } from '@nestjs/swagger';
import { CreateConsignatarioDto } from './create-consignatario.dto';
import { IsString, IsOptional, Length, Matches } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateConsignatarioDto extends PartialType(
  CreateConsignatarioDto,
) {
  @ApiPropertyOptional({
    description: 'Nombres completos del consignatario',
    example: 'Carlos Alberto López',
    minLength: 3,
    maxLength: 200,
  })
  @IsOptional()
  @IsString({ message: 'Los nombres deben ser un texto' })
  @Length(3, 200, {
    message: 'Los nombres deben tener entre 3 y 200 caracteres',
  })
  nombres?: string;

  @ApiPropertyOptional({
    description: 'Número de teléfono del consignatario',
    example: '79876543',
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
