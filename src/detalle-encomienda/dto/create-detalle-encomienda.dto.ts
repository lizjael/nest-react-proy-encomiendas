// detalle-encomiendas/dto/create-detalle-encomienda.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsInt,
  IsPositive,
  IsNumber,
  Min,
  MaxLength,
} from 'class-validator';

export class CreateDetalleEncomiendaDto {
  @ApiProperty({
    example: 'Laptop HP Pavilion',
    description: 'Descripción del producto',
  })
  @IsString()
  @MaxLength(500)
  descripcion: string;

  @ApiProperty({ example: 2, description: 'Cantidad de productos' })
  @IsInt()
  @IsPositive()
  cantidad: number;

  @ApiProperty({ example: 3.5, description: 'Peso en kilogramos' })
  @IsNumber()
  @Min(0)
  pesoKg: number;

  @ApiProperty({ example: 45.5, description: 'Costo de flete por este item' })
  @IsNumber()
  @Min(0)
  costoFlete: number;

  @ApiProperty({ example: 1, description: 'ID de la encomienda' })
  @IsInt()
  @IsPositive()
  idEncomienda: number;
}
