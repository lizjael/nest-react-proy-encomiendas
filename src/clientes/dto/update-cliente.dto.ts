import { PartialType } from '@nestjs/swagger';
import { CreateClienteDto } from './create-cliente.dto';
import {
  IsString,
  IsOptional,
  Length,
  Matches,
  ValidateIf,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateClienteDto extends PartialType(CreateClienteDto) {
  @ApiPropertyOptional({
    description: 'Tipo de cliente: "persona" o "empresa"',
    example: 'empresa',
    enum: ['persona', 'empresa'],
  })
  @IsOptional()
  @IsString({ message: 'El tipo de cliente debe ser un texto' })
  @Matches(/^(persona|empresa)$/, {
    message: 'El tipo de cliente debe ser "persona" o "empresa"',
  })
  tipoCliente?: string;

  @ApiPropertyOptional({
    description: 'Nombre (si es persona) o Razón Social (si es empresa)',
    example: 'María López',
  })
  @IsOptional()
  @IsString({ message: 'El nombre/razón social debe ser un texto' })
  @Length(3, 200, { message: 'Debe tener entre 3 y 200 caracteres' })
  nombreRazonSocial?: string;

  @ApiPropertyOptional({
    description: 'Cédula de identidad (solo para personas)',
    example: '87654321',
  })
  @ValidateIf((o) => o.tipoCliente === 'persona')
  @IsOptional()
  @IsString({ message: 'El CI debe ser un texto' })
  @Length(4, 20, { message: 'El CI debe tener entre 4 y 20 caracteres' })
  @Matches(/^[0-9]+$/, { message: 'El CI solo debe contener números' })
  ci?: string;

  @ApiPropertyOptional({
    description: 'NIT (solo para empresas)',
    example: '9876543210123',
  })
  @ValidateIf((o) => o.tipoCliente === 'empresa')
  @IsOptional()
  @IsString({ message: 'El NIT debe ser un texto' })
  @Length(7, 20, { message: 'El NIT debe tener entre 7 y 20 caracteres' })
  @Matches(/^[0-9]+$/, { message: 'El NIT solo debe contener números' })
  nit?: string;

  @ApiPropertyOptional({
    description: 'Número de teléfono',
    example: '71234567',
  })
  @IsOptional()
  @IsString({ message: 'El teléfono debe ser un texto' })
  @Length(7, 20, { message: 'El teléfono debe tener entre 7 y 20 caracteres' })
  @Matches(/^[0-9+-]+$/, {
    message: 'El teléfono solo puede contener números, + y -',
  })
  telefono?: string;

  @ApiPropertyOptional({
    description: 'Dirección completa',
    example: 'Calle Sucre #456, La Paz',
  })
  @IsOptional()
  @IsString({ message: 'La dirección debe ser un texto' })
  @Length(5, 255, {
    message: 'La dirección debe tener entre 5 y 255 caracteres',
  })
  direccion?: string;
}
