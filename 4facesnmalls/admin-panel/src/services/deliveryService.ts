import { apiClient } from '@/lib/apiClient';
import { Delivery, DeliveryStatus } from '@/types/delivery';

export interface DeliveryFilters {
  status?: DeliveryStatus;
  customerId?: string;
  driverId?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export interface DeliveryListResponse {
  data: Delivery[];
  total: number;
  page: number;
  limit: number;
}

export const deliveryService = {
  async getDeliveries(filters: DeliveryFilters = {}): Promise<DeliveryListResponse> {
    const response = await apiClient.get('/deliveries', { params: filters });
    return response.data;
  },

  async getDeliveryById(id: string): Promise<Delivery> {
    const response = await apiClient.get(`/deliveries/${id}`);
    return response.data;
  },

  async createDelivery(delivery: Omit<Delivery, '_id' | 'createdAt' | 'updatedAt'>): Promise<Delivery> {
    const response = await apiClient.post('/deliveries', delivery);
    return response.data;
  },

  async updateDelivery(id: string, delivery: Partial<Delivery>): Promise<Delivery> {
    const response = await apiClient.patch(`/deliveries/${id}`, delivery);
    return response.data;
  },

  async deleteDelivery(id: string): Promise<void> {
    await apiClient.delete(`/deliveries/${id}`);
  },

  async updateDeliveryStatus(id: string, status: DeliveryStatus): Promise<Delivery> {
    const response = await apiClient.patch(`/deliveries/${id}/status`, { status });
    return response.data;
  },

  async assignDriver(id: string, driverId: string): Promise<Delivery> {
    const response = await apiClient.patch(`/deliveries/${id}/assign`, { driverId });
    return response.data;
  }
}; 