// detalle-encomiendas/detalle-encomiendas.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { DetalleEncomiendasService } from './detalle-encomienda.service';
import { CreateDetalleEncomiendaDto } from './dto/create-detalle-encomienda.dto';
import { UpdateDetalleEncomiendaDto } from './dto/update-detalle-encomienda.dto';
import { Auth } from '../auth/decorators/auth.decorators';
import { Role } from '../common/enums/rol.enum';
import { ActiveUser } from '../common/decorators/active-user.decorator';
import type { UserActiveInterface } from '../common/interfaces/user-active.interface';

@ApiTags('Detalle de Encomiendas')
@ApiBearerAuth()
@Controller('detalle-encomiendas')
@Auth(Role.USER)
export class DetalleEncomiendasController {
  constructor(private readonly detalleService: DetalleEncomiendasService) {}

  @Post()
  @Auth(Role.ADMIN)
  @ApiOperation({ summary: 'Agregar detalle a una encomienda' })
  @ApiBody({ type: CreateDetalleEncomiendaDto })
  @ApiResponse({ status: 201, description: 'Detalle creado' })
  create(
    @Body() createDetalleDto: CreateDetalleEncomiendaDto,
    @ActiveUser() user: UserActiveInterface,
  ) {
    return this.detalleService.create(createDetalleDto, user);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los detalles' })
  @ApiResponse({ status: 200, description: 'Lista de detalles' })
  findAll(@ActiveUser() user: UserActiveInterface) {
    return this.detalleService.findAll(user);
  }

  // ✅ PRIMERO: Rutas específicas (con strings fijos)
  @Get('encomienda/:idEncomienda')
  @ApiOperation({ summary: 'Listar detalles de una encomienda específica' })
  @ApiParam({
    name: 'idEncomienda',
    type: Number,
    description: 'ID de la encomienda',
  })
  findAllByEncomienda(
    @Param('idEncomienda', ParseIntPipe) idEncomienda: number,
    @ActiveUser() user: UserActiveInterface,
  ) {
    return this.detalleService.findAllByEncomienda(idEncomienda, user);
  }

  // ✅ SEGUNDO: Ruta genérica con parámetro (debe ir al final)
  @Get(':id')
  @ApiOperation({ summary: 'Obtener detalle por ID' })
  @ApiParam({ name: 'id', type: Number, description: 'ID del detalle' })
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @ActiveUser() user: UserActiveInterface,
  ) {
    return this.detalleService.findOne(id, user);
  }

  @Patch(':id')
  @Auth(Role.ADMIN)
  @ApiOperation({ summary: 'Actualizar detalle' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateDetalleEncomiendaDto })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDetalleDto: UpdateDetalleEncomiendaDto,
    @ActiveUser() user: UserActiveInterface,
  ) {
    return this.detalleService.update(id, updateDetalleDto, user);
  }

  @Delete(':id')
  @Auth(Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Eliminar detalle (solo SUPER_ADMIN)' })
  @ApiParam({ name: 'id', type: Number })
  remove(
    @Param('id', ParseIntPipe) id: number,
    @ActiveUser() user: UserActiveInterface,
  ) {
    return this.detalleService.remove(id, user);
  }
}
