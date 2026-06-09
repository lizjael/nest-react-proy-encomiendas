import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Consignatario } from './entities/consignatario.entity';
import { CreateConsignatarioDto } from './dto/create-consignatario.dto';
import { UpdateConsignatarioDto } from './dto/update-consignatario.dto';

@Injectable()
export class ConsignatariosService {
  constructor(
    @InjectRepository(Consignatario)
    private consignatariosRepository: Repository<Consignatario>,
  ) {}

  async create(
    createConsignatarioDto: CreateConsignatarioDto,
  ): Promise<Consignatario> {
    const consignatario = this.consignatariosRepository.create(
      createConsignatarioDto,
    );
    return await this.consignatariosRepository.save(consignatario);
  }

  async findAll(): Promise<Consignatario[]> {
    return await this.consignatariosRepository.find();
  }

  async findOne(id: number): Promise<Consignatario> {
    const consignatario = await this.consignatariosRepository.findOne({
      where: { idConsignatario: id },
    });

    if (!consignatario) {
      throw new NotFoundException(`Consignatario con ID ${id} no encontrado`);
    }

    return consignatario;
  }

  async update(
    id: number,
    updateConsignatarioDto: UpdateConsignatarioDto,
  ): Promise<Consignatario> {
    const consignatario = await this.findOne(id);
    this.consignatariosRepository.merge(consignatario, updateConsignatarioDto);
    return await this.consignatariosRepository.save(consignatario);
  }

  async remove(id: number): Promise<Consignatario> {
    const consignatario = await this.findOne(id);
    return await this.consignatariosRepository.softRemove(consignatario);
  }
}
