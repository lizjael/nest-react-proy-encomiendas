import {
  IsString,
  IsNotEmpty,
  IsOptional,
  Length,
  Matches,
  ValidateIf,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateClienteDto {
  @ApiProperty({
    description: 'Tipo de cliente: "persona" o "empresa"',
    example: 'persona',
    enum: ['persona', 'empresa'],
  })
  @IsString({ message: 'El tipo de cliente debe ser un texto' })
  @IsNotEmpty({ message: 'El tipo de cliente es obligatorio' })
  @Matches(/^(persona|empresa)$/, {
    message: 'El tipo de cliente debe ser "persona" o "empresa"',
  })
  tipoCliente: string;

  @ApiProperty({
    description: 'Nombre (si es persona) o Razón Social (si es empresa)',
    example: 'Juan Pérez',
  })
  @IsString({ message: 'El nombre/razón social debe ser un texto' })
  @IsNotEmpty({ message: 'El nombre/razón social es obligatorio' })
  @Length(3, 200, { message: 'Debe tener entre 3 y 200 caracteres' })
  nombreRazonSocial: string;

  @ApiProperty({
    description: 'Cédula de identidad (obligatorio para personas)',
    example: '12345678',
    required: false,
  })
  @ValidateIf((o) => o.tipoCliente === 'persona')
  @IsNotEmpty({ message: 'El CI es obligatorio para personas' })
  @IsString({ message: 'El CI debe ser un texto' })
  @Length(4, 20, { message: 'El CI debe tener entre 4 y 20 caracteres' })
  @Matches(/^[0-9]+$/, { message: 'El CI solo debe contener números' })
  ci: string;

  @ApiProperty({
    description: 'NIT (obligatorio para empresas)',
    example: '1234567890123',
    required: false,
  })
  @ValidateIf((o) => o.tipoCliente === 'empresa')
  @IsNotEmpty({ message: 'El NIT es obligatorio para empresas' })
  @IsString({ message: 'El NIT debe ser un texto' })
  @Length(7, 20, { message: 'El NIT debe tener entre 7 y 20 caracteres' })
  @Matches(/^[0-9]+$/, { message: 'El NIT solo debe contener números' })
  nit: string;

  @ApiProperty({
    description: 'Número de teléfono',
    example: '76543210',
  })
  @IsString({ message: 'El teléfono debe ser un texto' })
  @IsNotEmpty({ message: 'El teléfono es obligatorio' })
  @Length(7, 20, { message: 'El teléfono debe tener entre 7 y 20 caracteres' })
  @Matches(/^[0-9+-]+$/, {
    message: 'El teléfono solo puede contener números, + y -',
  })
  telefono: string;

  @ApiProperty({
    description: 'Dirección completa',
    example: 'Av. Libertad #123, Cochabamba',
  })
  @IsString({ message: 'La dirección debe ser un texto' })
  @IsNotEmpty({ message: 'La dirección es obligatoria' })
  @Length(5, 255, {
    message: 'La dirección debe tener entre 5 y 255 caracteres',
  })
  direccion: string;
}
