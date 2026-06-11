// encomiendas/dto/create-encomienda.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsInt,
  IsPositive,
  IsNumber,
  IsOptional,
  IsDateString,
  Min,
  MaxLength,
  IsIn,
} from 'class-validator';

export class CreateEncomiendaDto {
  @ApiProperty({
    example: 'GUI-2024-0001',
    description: 'Número de guía único',
  })
  @IsString()
  @MaxLength(50)
  nroGuia: string;

  @ApiProperty({ example: '2024-01-15', description: 'Fecha de emisión' })
  @IsDateString()
  fechaEmision: string;

  @ApiProperty({
    example: '2024-01-30',
    description: 'Fecha límite de entrega',
  })
  @IsDateString()
  fechaLimiteEntrega: string;

  @ApiProperty({
    example: 'Frágil',
    description: 'Observaciones',
    required: false,
  })
  @IsString()
  @IsOptional()
  observaciones?: string;

  @ApiProperty({ example: 150.5, description: 'Costo total' })
  @IsNumber()
  @Min(0)
  costoTotal: number;

  @ApiProperty({
    example: 'PENDIENTE',
    description: 'Estado de entrega',
    required: false,
  })
  @IsString()
  @IsOptional()
  @IsIn(['PENDIENTE', 'EN_TRANSITO', 'ENTREGADO', 'DEVUELTO'])
  estadoEntrega?: string;

  @ApiProperty({
    example: 'PENDIENTE',
    description: 'Estado de pago',
    required: false,
  })
  @IsString()
  @IsOptional()
  @IsIn(['PENDIENTE', 'PAGADO', 'PARCIAL'])
  estadoPago?: string;

  @ApiProperty({ example: 1, description: 'ID del cliente' })
  @IsInt()
  @IsPositive()
  idCliente: number;

  @ApiProperty({ example: 1, description: 'ID del consignatario' })
  @IsInt()
  @IsPositive()
  idConsignatario: number;

  @ApiProperty({ example: 1, description: 'ID del empleado que registra' })
  @IsInt()
  @IsPositive()
  idEmpleado: number;

  @ApiProperty({ example: 1, description: 'ID de sucursal de origen' })
  @IsInt()
  @IsPositive()
  idSucursalOrigen: number;

  @ApiProperty({ example: 2, description: 'ID de sucursal de destino' })
  @IsInt()
  @IsPositive()
  idSucursalDestino: number;
}
