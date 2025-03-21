import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Recurrency, RecurrencyDocument, RecurrencyFrequency, RecurrencyStatus } from './schemas/recurrency.schema';
import { CreateRecurrencyDto } from './dto/create-recurrency.dto';
import { UpdateRecurrencyDto } from './dto/update-recurrency.dto';
import { DeliveriesService } from '../deliveries/deliveries.service';

@Injectable()
export class RecurrenciesService {
  constructor(
    @InjectModel(Recurrency.name) private recurrencyModel: Model<RecurrencyDocument>,
    private deliveriesService: DeliveriesService,
  ) {}

  async create(createRecurrencyDto: CreateRecurrencyDto): Promise<Recurrency> {
    // Validar parâmetros específicos de acordo com a frequência escolhida
    this.validateFrequencyParams(createRecurrencyDto);
    
    // Calcular o valor total se não fornecido (soma dos itens + taxa)
    if (!createRecurrencyDto.totalValue) {
      const itemsTotal = createRecurrencyDto.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
      );
      const deliveryFee = createRecurrencyDto.deliveryFee || 0;
      createRecurrencyDto.totalValue = itemsTotal + deliveryFee;
    }
    
    // Calcular a próxima data de entrega
    const nextDeliveryDate = this.calculateNextDeliveryDate(
      new Date(createRecurrencyDto.startDate),
      createRecurrencyDto.frequency,
      createRecurrencyDto.weekDay,
      createRecurrencyDto.monthDay,
      createRecurrencyDto.customDays,
    );

    // Criar a recorrência
    const newRecurrency = new this.recurrencyModel({
      ...createRecurrencyDto,
      nextDeliveryDate,
      deliveriesCount: 0,
      deliveries: [],
    });

    return newRecurrency.save();
  }

  async findAll(query: any = {}): Promise<Recurrency[]> {
    const { limit = 100, skip = 0, ...filters } = query;
    
    // Processar filtros
    const dbQuery = this.buildQuery(filters);
    
    return this.recurrencyModel
      .find(dbQuery)
      .populate('customer', 'name phone email')
      .limit(Number(limit))
      .skip(Number(skip))
      .sort({ updatedAt: -1 })
      .exec();
  }

  async findOne(id: string): Promise<Recurrency> {
    const recurrency = await this.recurrencyModel
      .findById(id)
      .populate('customer', 'name phone email addresses')
      .populate('deliveries')
      .exec();
      
    if (!recurrency) {
      throw new NotFoundException(`Recorrência com ID ${id} não encontrada`);
    }
    
    return recurrency;
  }

  async update(id: string, updateRecurrencyDto: UpdateRecurrencyDto): Promise<Recurrency> {
    const recurrency = await this.recurrencyModel.findById(id).exec();
    
    if (!recurrency) {
      throw new NotFoundException(`Recorrência com ID ${id} não encontrada`);
    }
    
    // Se a frequência foi alterada, validar os parâmetros necessários
    if (updateRecurrencyDto.frequency) {
      this.validateFrequencyParams({
        ...recurrency.toObject(),
        ...updateRecurrencyDto,
      });
      
      // Recalcular a próxima data de entrega
      const startDate = new Date(updateRecurrencyDto.startDate || recurrency.startDate);
      const frequency = updateRecurrencyDto.frequency || recurrency.frequency;
      const weekDay = updateRecurrencyDto.weekDay !== undefined ? updateRecurrencyDto.weekDay : recurrency.weekDay;
      const monthDay = updateRecurrencyDto.monthDay !== undefined ? updateRecurrencyDto.monthDay : recurrency.monthDay;
      const customDays = updateRecurrencyDto.customDays || recurrency.customDays;
      
      updateRecurrencyDto.nextDeliveryDate = this.calculateNextDeliveryDate(
        startDate,
        frequency,
        weekDay,
        monthDay,
        customDays,
      );
    }
    
    // Se os itens ou a taxa de entrega foram atualizados, recalcular o valor total
    if (updateRecurrencyDto.items || updateRecurrencyDto.deliveryFee !== undefined) {
      const items = updateRecurrencyDto.items || recurrency.items;
      const itemsTotal = items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
      );
      const deliveryFee = updateRecurrencyDto.deliveryFee !== undefined 
        ? updateRecurrencyDto.deliveryFee 
        : recurrency.deliveryFee;
        
      updateRecurrencyDto.totalValue = itemsTotal + deliveryFee;
    }
    
    // Atualizar a recorrência
    const updatedRecurrency = await this.recurrencyModel
      .findByIdAndUpdate(id, updateRecurrencyDto, { new: true })
      .exec();
      
    return updatedRecurrency;
  }

  async remove(id: string): Promise<Recurrency> {
    const deletedRecurrency = await this.recurrencyModel
      .findByIdAndDelete(id)
      .exec();
      
    if (!deletedRecurrency) {
      throw new NotFoundException(`Recorrência com ID ${id} não encontrada`);
    }
    
    return deletedRecurrency;
  }

  async getCustomerRecurrencies(customerId: string, query: any = {}): Promise<Recurrency[]> {
    const { limit = 100, skip = 0, ...filters } = query;
    
    // Adicionar filtro por cliente
    const dbQuery = {
      ...this.buildQuery(filters),
      customer: customerId,
    };
    
    return this.recurrencyModel
      .find(dbQuery)
      .limit(Number(limit))
      .skip(Number(skip))
      .sort({ updatedAt: -1 })
      .exec();
  }

  async pauseRecurrency(id: string): Promise<Recurrency> {
    const recurrency = await this.recurrencyModel.findById(id).exec();
    
    if (!recurrency) {
      throw new NotFoundException(`Recorrência com ID ${id} não encontrada`);
    }
    
    recurrency.status = RecurrencyStatus.PAUSED;
    
    return recurrency.save();
  }

  async activateRecurrency(id: string): Promise<Recurrency> {
    const recurrency = await this.recurrencyModel.findById(id).exec();
    
    if (!recurrency) {
      throw new NotFoundException(`Recorrência com ID ${id} não encontrada`);
    }
    
    recurrency.status = RecurrencyStatus.ACTIVE;
    
    // Recalcular a próxima data de entrega
    recurrency.nextDeliveryDate = this.calculateNextDeliveryDate(
      new Date(),
      recurrency.frequency,
      recurrency.weekDay,
      recurrency.monthDay,
      recurrency.customDays,
    );
    
    return recurrency.save();
  }

  async cancelRecurrency(id: string): Promise<Recurrency> {
    const recurrency = await this.recurrencyModel.findById(id).exec();
    
    if (!recurrency) {
      throw new NotFoundException(`Recorrência com ID ${id} não encontrada`);
    }
    
    recurrency.status = RecurrencyStatus.CANCELLED;
    recurrency.nextDeliveryDate = null;
    
    return recurrency.save();
  }

  async generateDelivery(id: string, userId: string): Promise<any> {
    const recurrency = await this.recurrencyModel.findById(id).exec();
    
    if (!recurrency) {
      throw new NotFoundException(`Recorrência com ID ${id} não encontrada`);
    }
    
    if (recurrency.status !== RecurrencyStatus.ACTIVE) {
      throw new BadRequestException(`Recorrência ${id} não está ativa`);
    }
    
    // Criar a entrega baseada na recorrência
    const deliveryData = {
      customer: recurrency.customer,
      deliveryAddress: recurrency.deliveryAddress,
      items: recurrency.items,
      scheduledDate: recurrency.nextDeliveryDate,
      totalValue: recurrency.totalValue,
      deliveryFee: recurrency.deliveryFee,
      paymentMethod: recurrency.paymentMethod,
      notes: recurrency.notes,
      recurrencyId: recurrency._id,
    };
    
    // Criar a entrega no sistema
    const delivery = await this.deliveriesService.create(deliveryData, userId);
    
    // Atualizar a recorrência
    recurrency.deliveries.push(new Types.ObjectId(delivery._id));
    recurrency.deliveriesCount += 1;
    
    // Calcular a próxima data de entrega
    recurrency.nextDeliveryDate = this.calculateNextDeliveryDate(
      new Date(recurrency.nextDeliveryDate),
      recurrency.frequency,
      recurrency.weekDay,
      recurrency.monthDay,
      recurrency.customDays,
    );
    
    // Verificar se chegou ao fim da recorrência
    if (recurrency.endDate && recurrency.nextDeliveryDate > new Date(recurrency.endDate)) {
      recurrency.status = RecurrencyStatus.COMPLETED;
      recurrency.nextDeliveryDate = null;
    }
    
    await recurrency.save();
    
    return { delivery, recurrency };
  }

  // Função para processar entregas recorrentes programadas para hoje
  async processRecurrenciesDueToday(userId: string): Promise<any> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Buscar recorrências ativas com próxima entrega para hoje
    const dueRecurrencies = await this.recurrencyModel.find({
      status: RecurrencyStatus.ACTIVE,
      nextDeliveryDate: {
        $gte: today,
        $lt: tomorrow,
      },
    }).exec();
    
    const results = [];
    
    // Gerar entregas para cada recorrência
    for (const recurrency of dueRecurrencies) {
      try {
        const result = await this.generateDelivery(recurrency._id, userId);
        results.push({
          recurrencyId: recurrency._id,
          success: true,
          deliveryId: result.delivery._id,
        });
      } catch (error) {
        results.push({
          recurrencyId: recurrency._id,
          success: false,
          error: error.message,
        });
      }
    }
    
    return {
      processed: dueRecurrencies.length,
      results,
    };
  }

  private validateFrequencyParams(data: any): void {
    switch (data.frequency) {
      case RecurrencyFrequency.WEEKLY:
      case RecurrencyFrequency.BIWEEKLY:
        if (data.weekDay === undefined) {
          throw new BadRequestException('Para frequência semanal ou quinzenal, o parâmetro weekDay é obrigatório');
        }
        break;
        
      case RecurrencyFrequency.MONTHLY:
        if (data.monthDay === undefined) {
          throw new BadRequestException('Para frequência mensal, o parâmetro monthDay é obrigatório');
        }
        break;
        
      case RecurrencyFrequency.CUSTOM:
        if (!data.customDays || data.customDays.length === 0) {
          throw new BadRequestException('Para frequência customizada, o parâmetro customDays é obrigatório');
        }
        break;
    }
  }

  private calculateNextDeliveryDate(
    startDate: Date,
    frequency: RecurrencyFrequency,
    weekDay?: number,
    monthDay?: number,
    customDays?: number[],
  ): Date {
    const now = new Date();
    let nextDate = new Date(startDate);
    
    // Garantir que a data seja no futuro
    if (nextDate < now) {
      nextDate = new Date(now);
    }
    
    switch (frequency) {
      case RecurrencyFrequency.DAILY:
        // Se a data atual já passou do horário de entrega, agendar para o próximo dia
        if (nextDate.getDate() === now.getDate()) {
          nextDate.setDate(nextDate.getDate() + 1);
        }
        break;
        
      case RecurrencyFrequency.WEEKLY:
        // Ajustar para o próximo dia da semana específico
        while (nextDate.getDay() !== weekDay) {
          nextDate.setDate(nextDate.getDate() + 1);
        }
        break;
        
      case RecurrencyFrequency.BIWEEKLY:
        // Ajustar para o próximo dia da semana específico
        while (nextDate.getDay() !== weekDay) {
          nextDate.setDate(nextDate.getDate() + 1);
        }
        
        // Verificar se está na semana atual, se sim, adicionar mais uma semana
        const tempDate = new Date(nextDate);
        if (tempDate.getDate() - now.getDate() < 7) {
          nextDate.setDate(nextDate.getDate() + 7);
        }
        break;
        
      case RecurrencyFrequency.MONTHLY:
        // Ajustar para o dia específico do mês atual
        nextDate.setDate(monthDay);
        
        // Se esse dia já passou no mês atual, ir para o próximo mês
        if (nextDate < now) {
          nextDate.setMonth(nextDate.getMonth() + 1);
        }
        
        // Verificar se o dia existe no mês (ex: 31 de Fevereiro)
        const daysInMonth = new Date(nextDate.getFullYear(), nextDate.getMonth() + 1, 0).getDate();
        if (monthDay > daysInMonth) {
          nextDate.setDate(daysInMonth);
        }
        break;
        
      case RecurrencyFrequency.CUSTOM:
        // Ordenar os dias personalizados
        const sortedDays = [...customDays].sort((a, b) => a - b);
        
        // Encontrar o próximo dia do mês atual que está nos dias personalizados
        let foundFutureDay = false;
        for (const day of sortedDays) {
          const tempDate = new Date(nextDate);
          tempDate.setDate(day);
          
          if (tempDate > now) {
            nextDate = tempDate;
            foundFutureDay = true;
            break;
          }
        }
        
        // Se não encontrou um dia futuro no mês atual, ir para o primeiro dia do próximo mês
        if (!foundFutureDay) {
          nextDate.setMonth(nextDate.getMonth() + 1);
          nextDate.setDate(sortedDays[0]);
        }
        break;
    }
    
    return nextDate;
  }

  private buildQuery(filters: any): any {
    const query: any = {};
    
    // Filtrar por status
    if (filters.status) {
      query.status = filters.status;
    }
    
    // Filtrar por frequência
    if (filters.frequency) {
      query.frequency = filters.frequency;
    }
    
    return query;
  }
} 