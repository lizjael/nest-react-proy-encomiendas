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
import { ConsignatariosService } from './consignatarios.service';
import { CreateConsignatarioDto } from './dto/create-consignatario.dto';
import { UpdateConsignatarioDto } from './dto/update-consignatario.dto';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
//import { Auth } from 'src/auth/decorators/auth.decorators';
//import { Role } from 'src/common/enums/rol.enum';

@ApiTags('consignatarios')
@Controller('consignatarios')
//@Auth(Role.ADMIN)
export class ConsignatariosController {
  constructor(private readonly consignatariosService: ConsignatariosService) {}

  @Post()
  @ApiOperation({
    summary: 'Crear un nuevo consignatario',
    description: 'Crea un nuevo consignatario en el sistema',
  })
  @ApiBody({
    type: CreateConsignatarioDto,
    description: 'Datos necesarios para crear un consignatario',
  })
  @ApiResponse({
    status: 201,
    description: 'Consignatario creado correctamente',
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos',
  })
  create(@Body() createConsignatarioDto: CreateConsignatarioDto) {
    return this.consignatariosService.create(createConsignatarioDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Listar consignatarios',
    description:
      'Obtiene todos los consignatarios registrados (no incluye eliminados)',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de consignatarios obtenida correctamente',
  })
  findAll() {
    return this.consignatariosService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener consignatario por ID',
    description: 'Obtiene un consignatario específico mediante su ID',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del consignatario',
    example: 1,
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Consignatario encontrado',
  })
  @ApiResponse({
    status: 404,
    description: 'Consignatario no encontrado',
  })
  findOne(
    @Param('id', ParseIntPipe)
    id: number,
  ) {
    return this.consignatariosService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar consignatario',
    description: 'Actualiza parcialmente un consignatario existente',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del consignatario',
    example: 1,
    type: Number,
  })
  @ApiBody({
    type: UpdateConsignatarioDto,
    description: 'Datos para actualizar un consignatario',
  })
  @ApiResponse({
    status: 200,
    description: 'Consignatario actualizado correctamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Consignatario no encontrado',
  })
  update(
    @Param('id', ParseIntPipe)
    id: number,
    @Body()
    updateConsignatarioDto: UpdateConsignatarioDto,
  ) {
    return this.consignatariosService.update(id, updateConsignatarioDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Eliminar consignatario',
    description: 'Realiza un borrado lógico de un consignatario',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del consignatario',
    example: 1,
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Consignatario eliminado correctamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Consignatario no encontrado',
  })
  remove(
    @Param('id', ParseIntPipe)
    id: number,
  ) {
    return this.consignatariosService.remove(id);
  }
}
