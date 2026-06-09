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
import { SucursalesService } from './sucursales.service';
import { CreateSucursalDto } from './dto/create-sucursal.dto';
import { UpdateSucursalDto } from './dto/update-sucursal.dto';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
//import { Auth } from 'src/auth/decorators/auth.decorators';
//import { Role } from 'src/common/enums/rol.enum';

@ApiTags('sucursales')
@Controller('sucursales')
//@Auth(Role.ADMIN)
export class SucursalesController {
  constructor(private readonly sucursalesService: SucursalesService) {}

  @Post()
  @ApiOperation({
    summary: 'Crear una nueva sucursal',
    description: 'Crea una nueva sucursal en el sistema',
  })
  @ApiBody({
    type: CreateSucursalDto,
    description: 'Datos necesarios para crear una sucursal',
  })
  @ApiResponse({
    status: 201,
    description: 'Sucursal creada correctamente',
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos',
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado - Se requiere autenticación',
  })
  @ApiResponse({
    status: 403,
    description: 'Prohibido - Se requiere rol de administrador',
  })
  create(@Body() createSucursalDto: CreateSucursalDto) {
    return this.sucursalesService.create(createSucursalDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Listar sucursales',
    description:
      'Obtiene todas las sucursales registradas (no incluye eliminadas)',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de sucursales obtenida correctamente',
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado - Se requiere autenticación',
  })
  @ApiResponse({
    status: 403,
    description: 'Prohibido - Se requiere rol de administrador',
  })
  findAll() {
    return this.sucursalesService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener sucursal por ID',
    description: 'Obtiene una sucursal específica mediante su ID',
  })
  @ApiParam({
    name: 'id',
    description: 'ID de la sucursal',
    example: 1,
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Sucursal encontrada',
  })
  @ApiResponse({
    status: 404,
    description: 'Sucursal no encontrada',
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado - Se requiere autenticación',
  })
  @ApiResponse({
    status: 403,
    description: 'Prohibido - Se requiere rol de administrador',
  })
  findOne(
    @Param('id', ParseIntPipe)
    id: number,
  ) {
    return this.sucursalesService.findOne(id);
  }

  @Get('ciudad/:ciudad')
  @ApiOperation({
    summary: 'Buscar sucursales por ciudad',
    description: 'Obtiene todas las sucursales de una ciudad específica',
  })
  @ApiParam({
    name: 'ciudad',
    description: 'Nombre de la ciudad',
    example: 'Cochabamba',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Sucursales encontradas',
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado - Se requiere autenticación',
  })
  @ApiResponse({
    status: 403,
    description: 'Prohibido - Se requiere rol de administrador',
  })
  findByCiudad(@Param('ciudad') ciudad: string) {
    return this.sucursalesService.findByCiudad(ciudad);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar sucursal',
    description: 'Actualiza parcialmente una sucursal existente',
  })
  @ApiParam({
    name: 'id',
    description: 'ID de la sucursal',
    example: 1,
    type: Number,
  })
  @ApiBody({
    type: UpdateSucursalDto,
    description: 'Datos para actualizar una sucursal',
  })
  @ApiResponse({
    status: 200,
    description: 'Sucursal actualizada correctamente',
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos',
  })
  @ApiResponse({
    status: 404,
    description: 'Sucursal no encontrada',
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado - Se requiere autenticación',
  })
  @ApiResponse({
    status: 403,
    description: 'Prohibido - Se requiere rol de administrador',
  })
  update(
    @Param('id', ParseIntPipe)
    id: number,
    @Body()
    updateSucursalDto: UpdateSucursalDto,
  ) {
    return this.sucursalesService.update(id, updateSucursalDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Eliminar sucursal',
    description: 'Realiza un borrado lógico de una sucursal',
  })
  @ApiParam({
    name: 'id',
    description: 'ID de la sucursal',
    example: 1,
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Sucursal eliminada correctamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Sucursal no encontrada',
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado - Se requiere autenticación',
  })
  @ApiResponse({
    status: 403,
    description: 'Prohibido - Se requiere rol de administrador',
  })
  remove(
    @Param('id', ParseIntPipe)
    id: number,
  ) {
    return this.sucursalesService.remove(id);
  }
}
