import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Customer, CustomerDocument } from './schemas/customer.schema';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Injectable()
export class CustomersService {
  constructor(
    @InjectModel(Customer.name) private customerModel: Model<CustomerDocument>,
  ) {}

  async findAll(query: any = {}): Promise<Customer[]> {
    const { limit = 100, skip = 0, ...filters } = query;
    
    // Processar filtros
    const dbQuery = this.buildQuery(filters);
    
    return this.customerModel
      .find(dbQuery)
      .limit(Number(limit))
      .skip(Number(skip))
      .sort({ updatedAt: -1 })
      .exec();
  }

  async findOne(id: string): Promise<Customer> {
    const customer = await this.customerModel.findById(id).exec();
    
    if (!customer) {
      throw new NotFoundException(`Cliente com ID ${id} não encontrado`);
    }
    
    return customer;
  }

  async create(createCustomerDto: CreateCustomerDto): Promise<Customer> {
    // Verificar se o e-mail já está em uso (se fornecido)
    if (createCustomerDto.email) {
      const existingCustomer = await this.customerModel
        .findOne({ email: createCustomerDto.email })
        .exec();
        
      if (existingCustomer) {
        throw new ConflictException('E-mail já está em uso');
      }
    }
    
    // Verificar CPF/CNPJ dependendo do tipo de cliente
    if (createCustomerDto.type === 'individual' && createCustomerDto.cpf) {
      const existingCustomer = await this.customerModel
        .findOne({ cpf: createCustomerDto.cpf })
        .exec();
        
      if (existingCustomer) {
        throw new ConflictException('CPF já está cadastrado');
      }
    } else if (createCustomerDto.type === 'company' && createCustomerDto.cnpj) {
      const existingCustomer = await this.customerModel
        .findOne({ cnpj: createCustomerDto.cnpj })
        .exec();
        
      if (existingCustomer) {
        throw new ConflictException('CNPJ já está cadastrado');
      }
    }
    
    // Criar o cliente
    const newCustomer = new this.customerModel(createCustomerDto);
    return newCustomer.save();
  }

  async update(
    id: string,
    updateCustomerDto: UpdateCustomerDto,
  ): Promise<Customer> {
    // Verificar se o cliente existe
    const existingCustomer = await this.customerModel.findById(id).exec();
    
    if (!existingCustomer) {
      throw new NotFoundException(`Cliente com ID ${id} não encontrado`);
    }
    
    // Verificar se o e-mail já está em uso por outro cliente
    if (updateCustomerDto.email && updateCustomerDto.email !== existingCustomer.email) {
      const customerWithEmail = await this.customerModel
        .findOne({ email: updateCustomerDto.email })
        .exec();
        
      if (customerWithEmail && customerWithEmail._id.toString() !== id) {
        throw new ConflictException('E-mail já está em uso por outro cliente');
      }
    }
    
    // Atualizar o cliente
    const updatedCustomer = await this.customerModel
      .findByIdAndUpdate(id, updateCustomerDto, { new: true })
      .exec();
      
    return updatedCustomer;
  }

  async remove(id: string): Promise<Customer> {
    const deletedCustomer = await this.customerModel
      .findByIdAndDelete(id)
      .exec();
      
    if (!deletedCustomer) {
      throw new NotFoundException(`Cliente com ID ${id} não encontrado`);
    }
    
    return deletedCustomer;
  }

  async addAddress(id: string, addressData: any): Promise<Customer> {
    const customer = await this.customerModel.findById(id).exec();
    
    if (!customer) {
      throw new NotFoundException(`Cliente com ID ${id} não encontrado`);
    }
    
    // Se o novo endereço for definido como principal, remover principal de outros
    if (addressData.isMain) {
      customer.addresses.forEach((address) => {
        address.isMain = false;
      });
    }
    
    // Adicionar o novo endereço
    customer.addresses.push(addressData);
    
    return customer.save();
  }

  async updateAddress(id: string, addressId: string, addressData: any): Promise<Customer> {
    const customer = await this.customerModel.findById(id).exec();
    
    if (!customer) {
      throw new NotFoundException(`Cliente com ID ${id} não encontrado`);
    }
    
    // Encontrar o endereço
    const addressIndex = customer.addresses.findIndex(
      (addr) => addr._id.toString() === addressId,
    );
    
    if (addressIndex === -1) {
      throw new NotFoundException(`Endereço com ID ${addressId} não encontrado`);
    }
    
    // Se o endereço estiver sendo definido como principal, remover principal de outros
    if (addressData.isMain) {
      customer.addresses.forEach((address) => {
        address.isMain = false;
      });
    }
    
    // Atualizar o endereço
    customer.addresses[addressIndex] = {
      ...customer.addresses[addressIndex].toObject(),
      ...addressData,
    };
    
    return customer.save();
  }

  async removeAddress(id: string, addressId: string): Promise<Customer> {
    const customer = await this.customerModel.findById(id).exec();
    
    if (!customer) {
      throw new NotFoundException(`Cliente com ID ${id} não encontrado`);
    }
    
    // Remover o endereço
    customer.addresses = customer.addresses.filter(
      (addr) => addr._id.toString() !== addressId,
    );
    
    return customer.save();
  }

  private buildQuery(filters: any): any {
    const query: any = {};
    
    // Filtrar por nome
    if (filters.name) {
      query.name = { $regex: filters.name, $options: 'i' };
    }
    
    // Filtrar por e-mail
    if (filters.email) {
      query.email = { $regex: filters.email, $options: 'i' };
    }
    
    // Filtrar por telefone
    if (filters.phone) {
      query.phone = { $regex: filters.phone, $options: 'i' };
    }
    
    // Filtrar por tipo de cliente
    if (filters.type) {
      query.type = filters.type;
    }
    
    // Filtrar por CPF
    if (filters.cpf) {
      query.cpf = { $regex: filters.cpf, $options: 'i' };
    }
    
    // Filtrar por CNPJ
    if (filters.cnpj) {
      query.cnpj = { $regex: filters.cnpj, $options: 'i' };
    }
    
    // Filtrar por status (ativo/inativo)
    if (filters.isActive !== undefined) {
      query.isActive = filters.isActive === 'true';
    }
    
    return query;
  }
} 