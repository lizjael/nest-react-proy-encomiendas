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
import { ClientesService } from './clientes.service';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
//import { Auth } from 'src/auth/decorators/auth.decorators';
//import { Role } from 'src/common/enums/rol.enum';

@ApiTags('clientes')
@Controller('clientes')
export class ClientesController {
  constructor(private readonly clientesService: ClientesService) {}

  @Post()
  @ApiOperation({
    summary: 'Crear un nuevo cliente',
    description: 'Crea un nuevo cliente en el sistema',
  })
  @ApiBody({
    type: CreateClienteDto,
    description: 'Datos necesarios para crear un cliente',
  })
  @ApiResponse({
    status: 201,
    description: 'Cliente creado correctamente',
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos (campos vacíos, formato incorrecto, etc.)',
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado - Se requiere autenticación',
  })
  @ApiResponse({
    status: 403,
    description: 'Prohibido - Se requiere rol de administrador',
  })
  create(@Body() createClienteDto: CreateClienteDto) {
    return this.clientesService.create(createClienteDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Listar clientes',
    description:
      'Obtiene todos los clientes registrados (no incluye eliminados)',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de clientes obtenida correctamente',
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
    return this.clientesService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener cliente por ID',
    description: 'Obtiene un cliente específico mediante su ID',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del cliente',
    example: 1,
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Cliente encontrado',
  })
  @ApiResponse({
    status: 404,
    description: 'Cliente no encontrado',
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
    return this.clientesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar cliente',
    description: 'Actualiza parcialmente un cliente existente',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del cliente',
    example: 1,
    type: Number,
  })
  @ApiBody({
    type: UpdateClienteDto,
    description: 'Datos para actualizar un cliente',
  })
  @ApiResponse({
    status: 200,
    description: 'Cliente actualizado correctamente',
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos',
  })
  @ApiResponse({
    status: 404,
    description: 'Cliente no encontrado',
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
    updateClienteDto: UpdateClienteDto,
  ) {
    return this.clientesService.update(id, updateClienteDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Eliminar cliente',
    description: 'Realiza un borrado lógico de un cliente',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del cliente',
    example: 1,
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Cliente eliminado correctamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Cliente no encontrado',
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
    return this.clientesService.remove(id);
  }
}
