import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Sucursal } from './entities/sucursal.entity';
import { CreateSucursalDto } from './dto/create-sucursal.dto';
import { UpdateSucursalDto } from './dto/update-sucursal.dto';

@Injectable()
export class SucursalesService {
  constructor(
    @InjectRepository(Sucursal)
    private sucursalesRepository: Repository<Sucursal>,
  ) {}

  async create(createSucursalDto: CreateSucursalDto): Promise<Sucursal> {
    const sucursal = this.sucursalesRepository.create(createSucursalDto);
    return await this.sucursalesRepository.save(sucursal);
  }

  async findAll(): Promise<Sucursal[]> {
    return await this.sucursalesRepository.find();
  }

  async findOne(id: number): Promise<Sucursal> {
    const sucursal = await this.sucursalesRepository.findOne({
      where: { idSucursal: id },
    });

    if (!sucursal) {
      throw new NotFoundException(`Sucursal con ID ${id} no encontrada`);
    }

    return sucursal;
  }

  async findByCiudad(ciudad: string): Promise<Sucursal[]> {
    const sucursales = await this.sucursalesRepository.find({
      where: { ciudad: Like(`%${ciudad}%`) },
    });

    if (sucursales.length === 0) {
      throw new NotFoundException(
        `No se encontraron sucursales en la ciudad: ${ciudad}`,
      );
    }

    return sucursales;
  }

  async update(
    id: number,
    updateSucursalDto: UpdateSucursalDto,
  ): Promise<Sucursal> {
    const sucursal = await this.findOne(id);
    this.sucursalesRepository.merge(sucursal, updateSucursalDto);
    return await this.sucursalesRepository.save(sucursal);
  }

  async remove(id: number): Promise<Sucursal> {
    const sucursal = await this.findOne(id);
    return await this.sucursalesRepository.softRemove(sucursal);
  }

  async onModuleInit() {
    await this.sucursalesRepository
      .createQueryBuilder()
      .update(Sucursal)
      .set({ activo: true })
      .where('activo IS NULL')
      .execute();
  }
}
