import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Delivery, DeliveryDocument, DeliveryStatus } from './schemas/delivery.schema';
import { CreateDeliveryDto } from './dto/create-delivery.dto';
import { UpdateDeliveryDto } from './dto/update-delivery.dto';
import { DeliverySignatureDto } from './dto/delivery-signature.dto';

@Injectable()
export class DeliveriesService {
  constructor(
    @InjectModel(Delivery.name) private deliveryModel: Model<DeliveryDocument>,
  ) {}

  async create(createDeliveryDto: CreateDeliveryDto, userId: string): Promise<Delivery> {
    // Calcular o valor total se não fornecido (soma dos itens + taxa)
    if (!createDeliveryDto.totalValue) {
      const itemsTotal = createDeliveryDto.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
      );
      const deliveryFee = createDeliveryDto.deliveryFee || 0;
      createDeliveryDto.totalValue = itemsTotal + deliveryFee;
    }

    // Adicionar entrada inicial ao histórico de status
    const statusHistory = [{
      status: createDeliveryDto.status || DeliveryStatus.PENDING,
      date: new Date(),
      by: userId,
    }];

    // Criar a entrega
    const newDelivery = new this.deliveryModel({
      ...createDeliveryDto,
      statusHistory,
    });

    return newDelivery.save();
  }

  async findAll(query: any = {}): Promise<Delivery[]> {
    const { limit = 100, skip = 0, ...filters } = query;
    
    // Processar filtros
    const dbQuery = this.buildQuery(filters);
    
    return this.deliveryModel
      .find(dbQuery)
      .populate('customer', 'name phone email')
      .populate('deliveryPerson', 'name')
      .limit(Number(limit))
      .skip(Number(skip))
      .sort({ updatedAt: -1 })
      .exec();
  }

  async findOne(id: string): Promise<Delivery> {
    const delivery = await this.deliveryModel
      .findById(id)
      .populate('customer', 'name phone email addresses')
      .populate('deliveryPerson', 'name phone email')
      .exec();
      
    if (!delivery) {
      throw new NotFoundException(`Entrega com ID ${id} não encontrada`);
    }
    
    return delivery;
  }

  async update(
    id: string,
    updateDeliveryDto: UpdateDeliveryDto,
    userId: string,
  ): Promise<Delivery> {
    const delivery = await this.deliveryModel.findById(id).exec();
    
    if (!delivery) {
      throw new NotFoundException(`Entrega com ID ${id} não encontrada`);
    }
    
    // Se o status estiver sendo alterado, adicionar ao histórico
    if (
      updateDeliveryDto.status &&
      updateDeliveryDto.status !== delivery.status
    ) {
      if (!delivery.statusHistory) {
        delivery.statusHistory = [];
      }
      
      delivery.statusHistory.push({
        status: updateDeliveryDto.status,
        date: new Date(),
        by: userId,
      });
      
      // Se o status for "entregue", registrar a data de entrega
      if (updateDeliveryDto.status === DeliveryStatus.DELIVERED) {
        updateDeliveryDto.deliveredAt = new Date();
      }
    }
    
    // Atualizar a entrega
    const updatedDelivery = await this.deliveryModel
      .findByIdAndUpdate(
        id,
        { ...updateDeliveryDto, statusHistory: delivery.statusHistory },
        { new: true }
      )
      .exec();
      
    return updatedDelivery;
  }

  async remove(id: string): Promise<Delivery> {
    const deletedDelivery = await this.deliveryModel
      .findByIdAndDelete(id)
      .exec();
      
    if (!deletedDelivery) {
      throw new NotFoundException(`Entrega com ID ${id} não encontrada`);
    }
    
    return deletedDelivery;
  }

  async addSignature(
    id: string,
    signatureDto: DeliverySignatureDto,
    userId: string,
  ): Promise<Delivery> {
    const delivery = await this.deliveryModel.findById(id).exec();
    
    if (!delivery) {
      throw new NotFoundException(`Entrega com ID ${id} não encontrada`);
    }
    
    if (delivery.status === DeliveryStatus.DELIVERED) {
      throw new BadRequestException('Entrega já foi finalizada');
    }
    
    // Atualizar o status para entregue
    delivery.status = DeliveryStatus.DELIVERED;
    delivery.deliveredAt = new Date();
    
    // Adicionar ao histórico de status
    if (!delivery.statusHistory) {
      delivery.statusHistory = [];
    }
    
    delivery.statusHistory.push({
      status: DeliveryStatus.DELIVERED,
      date: new Date(),
      by: userId,
    });
    
    // Adicionar a assinatura
    delivery.signature = {
      ...signatureDto,
      signatureDate: new Date(),
    };
    
    return delivery.save();
  }

  async updateLocation(
    id: string,
    location: { lat: number; lng: number },
    userId: string,
  ): Promise<Delivery> {
    const delivery = await this.deliveryModel.findById(id).exec();
    
    if (!delivery) {
      throw new NotFoundException(`Entrega com ID ${id} não encontrada`);
    }
    
    // Atualizar a localização
    delivery.lastLocation = location;
    
    // Se o status for pendente ou atribuído, atualizar para em trânsito
    if (
      delivery.status === DeliveryStatus.PENDING ||
      delivery.status === DeliveryStatus.ASSIGNED
    ) {
      delivery.status = DeliveryStatus.IN_TRANSIT;
      
      // Adicionar ao histórico de status
      if (!delivery.statusHistory) {
        delivery.statusHistory = [];
      }
      
      delivery.statusHistory.push({
        status: DeliveryStatus.IN_TRANSIT,
        date: new Date(),
        by: userId,
      });
    }
    
    return delivery.save();
  }

  async assignDeliveryPerson(
    id: string,
    deliveryPersonId: string,
    userId: string,
  ): Promise<Delivery> {
    const delivery = await this.deliveryModel.findById(id).exec();
    
    if (!delivery) {
      throw new NotFoundException(`Entrega com ID ${id} não encontrada`);
    }
    
    // Atualizar o entregador
    delivery.deliveryPerson = new Types.ObjectId(deliveryPersonId);
    
    // Atualizar o status para atribuído, se estiver pendente
    if (delivery.status === DeliveryStatus.PENDING) {
      delivery.status = DeliveryStatus.ASSIGNED;
      
      // Adicionar ao histórico de status
      if (!delivery.statusHistory) {
        delivery.statusHistory = [];
      }
      
      delivery.statusHistory.push({
        status: DeliveryStatus.ASSIGNED,
        date: new Date(),
        by: userId,
      });
    }
    
    return delivery.save();
  }

  async getDeliveryPerson(deliveryPersonId: string, query: any = {}): Promise<Delivery[]> {
    const { limit = 100, skip = 0, ...filters } = query;
    
    // Adicionar filtro por entregador
    const dbQuery = {
      ...this.buildQuery(filters),
      deliveryPerson: deliveryPersonId,
    };
    
    return this.deliveryModel
      .find(dbQuery)
      .populate('customer', 'name phone email')
      .limit(Number(limit))
      .skip(Number(skip))
      .sort({ updatedAt: -1 })
      .exec();
  }

  async getCustomerDeliveries(customerId: string, query: any = {}): Promise<Delivery[]> {
    const { limit = 100, skip = 0, ...filters } = query;
    
    // Adicionar filtro por cliente
    const dbQuery = {
      ...this.buildQuery(filters),
      customer: customerId,
    };
    
    return this.deliveryModel
      .find(dbQuery)
      .populate('deliveryPerson', 'name')
      .limit(Number(limit))
      .skip(Number(skip))
      .sort({ updatedAt: -1 })
      .exec();
  }

  private buildQuery(filters: any): any {
    const query: any = {};
    
    // Filtrar por status
    if (filters.status) {
      query.status = filters.status;
    }
    
    // Filtrar por data agendada
    if (filters.scheduledDate) {
      const date = new Date(filters.scheduledDate);
      
      // Buscar entregas no dia específico
      const startDate = new Date(date.setHours(0, 0, 0, 0));
      const endDate = new Date(date.setHours(23, 59, 59, 999));
      
      query.scheduledDate = {
        $gte: startDate,
        $lte: endDate,
      };
    }
    
    // Filtrar por data de entrega
    if (filters.deliveredAt) {
      const date = new Date(filters.deliveredAt);
      
      // Buscar entregas no dia específico
      const startDate = new Date(date.setHours(0, 0, 0, 0));
      const endDate = new Date(date.setHours(23, 59, 59, 999));
      
      query.deliveredAt = {
        $gte: startDate,
        $lte: endDate,
      };
    }
    
    // Filtrar por número de pedido externo
    if (filters.externalOrderNumber) {
      query.externalOrderNumber = { $regex: filters.externalOrderNumber, $options: 'i' };
    }
    
    // Filtrar por método de pagamento
    if (filters.paymentMethod) {
      query.paymentMethod = filters.paymentMethod;
    }
    
    // Filtrar por status de pagamento
    if (filters.isPaid !== undefined) {
      query.isPaid = filters.isPaid === 'true';
    }
    
    // Filtrar por recorrência
    if (filters.recurrencyId) {
      query.recurrencyId = filters.recurrencyId;
    }
    
    return query;
  }
} 