// encomiendas/encomiendas.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { EncomiendasService } from './encomiendas.service';
import { CreateEncomiendaDto } from './dto/create-encomienda.dto';
import { UpdateEncomiendaDto } from './dto/update-encomienda.dto';
import { Auth } from '../auth/decorators/auth.decorators';
import { Role } from '../common/enums/rol.enum';
import { ActiveUser } from '../common/decorators/active-user.decorator';
import type { UserActiveInterface } from '../common/interfaces/user-active.interface';

@ApiTags('encomiendas')
@Controller('encomiendas')
@Auth(Role.USER) // Mínimo USER autenticado
export class EncomiendasController {
  constructor(private readonly encomiendasService: EncomiendasService) {}

  @Post()
  @Auth(Role.ADMIN) // Solo ADMIN y SUPER_ADMIN pueden crear
  @ApiOperation({ summary: 'Crear encomienda' })
  @ApiBody({ type: CreateEncomiendaDto })
  @ApiResponse({ status: 201, description: 'Encomienda creada' })
  create(
    @Body() createEncomiendaDto: CreateEncomiendaDto,
    @ActiveUser() user: UserActiveInterface,
  ) {
    return this.encomiendasService.create(createEncomiendaDto, user);
  }

  @Get()
  @ApiOperation({ summary: 'Listar encomiendas' })
  @ApiResponse({ status: 200, description: 'Lista de encomiendas' })
  findAll(@ActiveUser() user: UserActiveInterface) {
    return this.encomiendasService.findAll(user);
  }

  @Get('buscar/guia')
  @ApiOperation({ summary: 'Buscar encomienda por número de guía' })
  @ApiQuery({ name: 'nroGuia', type: String })
  @ApiResponse({ status: 200, description: 'Encomienda encontrada' })
  findByGuia(
    @Query('nroGuia') nroGuia: string,
    @ActiveUser() user: UserActiveInterface,
  ) {
    return this.encomiendasService.findByGuia(nroGuia, user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener encomienda por ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Encomienda encontrada' })
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @ActiveUser() user: UserActiveInterface,
  ) {
    return this.encomiendasService.findOne(id, user);
  }

  @Patch(':id')
  @Auth(Role.ADMIN) // Solo ADMIN y SUPER_ADMIN pueden actualizar
  @ApiOperation({ summary: 'Actualizar encomienda' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateEncomiendaDto })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateEncomiendaDto: UpdateEncomiendaDto,
    @ActiveUser() user: UserActiveInterface,
  ) {
    return this.encomiendasService.update(id, updateEncomiendaDto, user);
  }

  @Delete(':id')
  @Auth(Role.SUPER_ADMIN) // Solo SUPER_ADMIN puede eliminar
  @ApiOperation({ summary: 'Eliminar encomienda' })
  @ApiParam({ name: 'id', type: Number })
  remove(
    @Param('id', ParseIntPipe) id: number,
    @ActiveUser() user: UserActiveInterface,
  ) {
    return this.encomiendasService.remove(id, user);
  }
}
