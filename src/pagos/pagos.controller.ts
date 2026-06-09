// pagos/pagos.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  ParseEnumPipe,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { PagosService } from './pagos.service';
import { CreatePagoDto } from './dto/create-pago.dto';
import { UpdatePagoDto } from './dto/update-pago.dto';
import { Auth } from '../auth/decorators/auth.decorators';
import { Role } from '../common/enums/rol.enum';
import { ActiveUser } from '../common/decorators/active-user.decorator';
import { MetodoPagoEnum } from '../common/enums/metodos-pago.enum';
import type { UserActiveInterface } from '../common/interfaces/user-active.interface';

@ApiTags('Pagos')
@ApiBearerAuth()
@Controller('pagos')
@Auth(Role.USER)
export class PagosController {
  constructor(private readonly pagosService: PagosService) {}

  // ==================== MÉTODOS DE PAGO (desde Enum) ====================

  // ✅ PRIMERO: Rutas específicas (sin parámetros dinámicos)
  @Get('metodos-pago')
  @ApiOperation({ summary: 'Listar métodos de pago disponibles' })
  @ApiResponse({ status: 200, description: 'Lista de métodos de pago' })
  findAllMetodosPago() {
    return this.pagosService.findAllMetodosPago();
  }

  // ✅ SEGUNDO: Rutas con parámetros dinámicos
  @Get('metodos-pago/validar/:nombre')
  @ApiOperation({ summary: 'Verificar método de pago por nombre' })
  @ApiParam({ name: 'nombre', enum: MetodoPagoEnum })
  findMetodoPagoByNombre(@Param('nombre') nombre: string) {
    return this.pagosService.findMetodoPagoByNombre(nombre);
  }

  // ==================== CRUD PAGOS ====================

  @Post()
  @Auth(Role.ADMIN)
  @ApiOperation({ summary: 'Registrar un pago' })
  @ApiBody({ type: CreatePagoDto })
  create(
    @Body() createPagoDto: CreatePagoDto,
    @ActiveUser() user: UserActiveInterface,
  ) {
    return this.pagosService.create(createPagoDto, user);
  }

  @Get()
  @ApiOperation({ summary: 'Listar pagos' })
  findAll(@ActiveUser() user: UserActiveInterface) {
    return this.pagosService.findAll(user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener pago por ID' })
  @ApiParam({ name: 'id', type: Number })
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @ActiveUser() user: UserActiveInterface,
  ) {
    return this.pagosService.findOne(id, user);
  }

  @Patch(':id')
  @Auth(Role.ADMIN)
  @ApiOperation({ summary: 'Actualizar pago' })
  @ApiParam({ name: 'id', type: Number })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePagoDto: UpdatePagoDto,
    @ActiveUser() user: UserActiveInterface,
  ) {
    return this.pagosService.update(id, updatePagoDto, user);
  }

  @Delete(':id')
  @Auth(Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Eliminar pago' })
  @ApiParam({ name: 'id', type: Number })
  remove(
    @Param('id', ParseIntPipe) id: number,
    @ActiveUser() user: UserActiveInterface,
  ) {
    return this.pagosService.remove(id, user);
  }
}
