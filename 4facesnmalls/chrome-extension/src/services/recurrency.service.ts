import api from './api';

export interface Recurrency {
  _id: string;
  customer: any;
  name: string;
  status: string;
  frequency: string;
  customDays?: number[];
  weekDay?: number;
  monthDay?: number;
  startDate: Date;
  endDate?: Date;
  nextDeliveryDate?: Date;
  deliveryAddress: object;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
    sku?: string;
    notes?: string;
  }>;
  totalValue: number;
  deliveryFee: number;
  paymentMethod: string;
  notes?: string;
  deliveriesCount: number;
  deliveries: string[];
  notifyCustomer: boolean;
  notificationHours: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface RecurrencySearchParams {
  customerId?: string;
  status?: string;
  frequency?: string;
  limit?: number;
  skip?: number;
}

class RecurrencyService {
  async getRecurrencies(params?: RecurrencySearchParams): Promise<Recurrency[]> {
    try {
      const response = await api.get('/recurrencies', { params });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getRecurrencyById(id: string): Promise<Recurrency> {
    try {
      const response = await api.get(`/recurrencies/${id}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getCustomerRecurrencies(customerId: string, params?: Omit<RecurrencySearchParams, 'customerId'>): Promise<Recurrency[]> {
    try {
      const response = await api.get(`/recurrencies/by-customer/${customerId}`, { params });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async findRecurrencyByCustomerDocument(document: string): Promise<Recurrency[]> {
    try {
      // Esta rota precisará ser implementada no backend
      const response = await api.get(`/recurrencies/by-document/${document}`);
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
          return new Error('Recorrência não encontrada.');
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

export default new RecurrencyService(); 