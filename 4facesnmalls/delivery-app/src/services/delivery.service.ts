import api from './api';

export interface DeliveryAddress {
  zipCode: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  reference?: string;
}

export interface DeliveryItem {
  name: string;
  quantity: number;
  price: number;
  sku?: string;
  notes?: string;
}

export interface DeliverySignature {
  signature: string;
  receiverName: string;
  receiverDocument?: string;
  notes?: string;
  proofPhoto?: string;
  signatureDate?: Date;
}

export interface DeliveryStatus {
  status: string;
  date: Date;
  by: string;
}

export enum DeliveryStatusEnum {
  PENDING = 'pending',
  ASSIGNED = 'assigned',
  IN_TRANSIT = 'in_transit',
  DELIVERED = 'delivered',
  RETURNED = 'returned',
  CANCELLED = 'cancelled',
}

export interface Delivery {
  _id: string;
  customer: any;
  deliveryPerson?: any;
  status: DeliveryStatusEnum;
  deliveryAddress: DeliveryAddress;
  items: DeliveryItem[];
  scheduledDate?: Date;
  deliveredAt?: Date;
  totalValue: number;
  deliveryFee: number;
  paymentMethod: string;
  isPaid: boolean;
  notes?: string;
  externalOrderNumber?: string;
  signature?: DeliverySignature;
  statusHistory: DeliveryStatus[];
  lastLocation?: { lat: number; lng: number };
  recurrencyId?: string;
  createdAt: Date;
  updatedAt: Date;
}

class DeliveryService {
  async getMyDeliveries(queryParams?: Record<string, any>): Promise<Delivery[]> {
    try {
      const response = await api.get('/deliveries/my-deliveries', {
        params: queryParams,
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getDeliveryById(id: string): Promise<Delivery> {
    try {
      const response = await api.get(`/deliveries/${id}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateDeliveryStatus(id: string, status: DeliveryStatusEnum): Promise<Delivery> {
    try {
      const response = await api.put(`/deliveries/${id}`, { status });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateDeliveryLocation(id: string, location: { lat: number; lng: number }): Promise<Delivery> {
    try {
      const response = await api.post(`/deliveries/${id}/location`, location);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async addDeliverySignature(id: string, signatureData: DeliverySignature): Promise<Delivery> {
    try {
      const response = await api.post(`/deliveries/${id}/signature`, signatureData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private handleError(error: any): Error {
    if (error.response) {
      // Erro da API com resposta
      const { status, data } = error.response;
      
      switch (status) {
        case 404:
          return new Error('Entrega não encontrada.');
        case 400:
          return new Error(data.message || 'Dados inválidos.');
        default:
          return new Error(data.message || 'Ocorreu um erro. Tente novamente mais tarde.');
      }
    } else if (error.request) {
      // Erro de conexão
      return new Error('Não foi possível conectar ao servidor. Verifique sua conexão com a internet.');
    } else {
      // Erro geral
      return new Error(error.message || 'Ocorreu um erro inesperado.');
    }
  }
}

export default new DeliveryService(); 