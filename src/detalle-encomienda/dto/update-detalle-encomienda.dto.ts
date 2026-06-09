// detalle-encomiendas/dto/update-detalle-encomienda.dto.ts
import { PartialType } from '@nestjs/swagger';
import { CreateDetalleEncomiendaDto } from './create-detalle-encomienda.dto';

export class UpdateDetalleEncomiendaDto extends PartialType(
  CreateDetalleEncomiendaDto,
) {}
