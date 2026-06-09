// pagos/dto/create-pago.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsPositive,
  IsNumber,
  IsDateString,
  IsOptional,
  IsString,
  IsIn,
  Min,
  MaxLength,
} from 'class-validator';
import { MetodoPagoEnum } from '../../common/enums/metodos-pago.enum';

export class CreatePagoDto {
  @ApiProperty({ example: 150.5, description: 'Monto del pago' })
  @IsNumber()
  @Min(0)
  monto: number;

  @ApiProperty({ example: '2024-01-15', description: 'Fecha del pago' })
  @IsDateString()
  fecha: Date;

  @ApiProperty({
    example: 'TRANS-2024-001',
    description: 'Referencia del pago',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  referencia?: string;

  @ApiProperty({
    example: 'https://...',
    description: 'Comprobante URL',
    required: false,
  })
  @IsString()
  @IsOptional()
  comprobanteUrl?: string;

  @ApiProperty({
    example: 'COMPLETADO',
    description: 'Estado del pago',
    enum: ['COMPLETADO', 'PENDIENTE', 'RECHAZADO', 'ANULADO'],
    default: 'PENDIENTE',
  })
  @IsString()
  @IsOptional()
  @IsIn(['COMPLETADO', 'PENDIENTE', 'RECHAZADO', 'ANULADO'])
  estado?: string;

  @ApiProperty({
    example: 'EFECTIVO',
    description: 'Método de pago',
    enum: MetodoPagoEnum,
    default: MetodoPagoEnum.EFECTIVO,
  })
  @IsString()
  @IsIn(Object.values(MetodoPagoEnum))
  metodoPago: MetodoPagoEnum;

  @ApiProperty({ example: 1, description: 'ID de la encomienda' })
  @IsInt()
  @IsPositive()
  idEncomienda: number;
}
