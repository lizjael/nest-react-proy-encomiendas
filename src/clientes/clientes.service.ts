import { Injectable } from '@nestjs/common';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cliente } from './entities/cliente.entity';

@Injectable()
export class ClientesService {
  constructor(
    @InjectRepository(Cliente)
    private clientesRepository: Repository<Cliente>,
  ) {}

  async create(createClienteDto: CreateClienteDto) {
    const cliente = this.clientesRepository.create(createClienteDto);
    return this.clientesRepository.save(cliente);
  }

  async findAll() {
    return this.clientesRepository.find();
  }

  async findOne(id: number) {
    return this.clientesRepository.findOneBy({ idCliente: id });
  }

  async update(id: number, updateClienteDto: UpdateClienteDto) {
    return this.clientesRepository.update({ idCliente: id }, updateClienteDto);
  }

  async remove(id: number) {
    return this.clientesRepository.delete({ idCliente: id });
  }
}
