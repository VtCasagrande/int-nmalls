import { api } from "./api";
import { Address } from "./customers";
import { DeliveryItem, PaymentMethod } from "./deliveries";

export enum RecurrencyStatus {
  ACTIVE = 'active',
  PAUSED = 'paused',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
}

export enum RecurrencyFrequency {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  BIWEEKLY = 'biweekly',
  MONTHLY = 'monthly',
  CUSTOM = 'custom',
}

export interface Recurrency {
  _id: string;
  customer: any;
  name: string;
  status: RecurrencyStatus;
  frequency: RecurrencyFrequency;
  customDays?: number[];
  weekDay?: number;
  monthDay?: number;
  startDate: string;
  endDate?: string;
  nextDeliveryDate?: string;
  deliveryAddress: Address;
  items: DeliveryItem[];
  totalValue: number;
  deliveryFee: number;
  paymentMethod: PaymentMethod;
  notes?: string;
  deliveriesCount: number;
  deliveries: string[];
  notifyCustomer: boolean;
  notificationHours: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRecurrencyDTO {
  customer: string;
  name: string;
  status?: RecurrencyStatus;
  frequency: RecurrencyFrequency;
  customDays?: number[];
  weekDay?: number;
  monthDay?: number;
  startDate: string;
  endDate?: string;
  deliveryAddress: Omit<Address, '_id' | 'isMain'>;
  items: DeliveryItem[];
  totalValue?: number;
  deliveryFee?: number;
  paymentMethod?: PaymentMethod;
  notes?: string;
  notifyCustomer?: boolean;
  notificationHours?: number;
}

export interface RecurrencySearchParams {
  status?: RecurrencyStatus;
  frequency?: RecurrencyFrequency;
  limit?: number;
  skip?: number;
}

export async function getRecurrencies(params?: RecurrencySearchParams): Promise<Recurrency[]> {
  const response = await api.get('/recurrencies', { params });
  return response.data;
}

export async function getRecurrencyById(id: string): Promise<Recurrency> {
  const response = await api.get(`/recurrencies/${id}`);
  return response.data;
}

export async function createRecurrency(recurrency: CreateRecurrencyDTO): Promise<Recurrency> {
  const response = await api.post('/recurrencies', recurrency);
  return response.data;
}

export async function updateRecurrency(id: string, recurrency: Partial<CreateRecurrencyDTO>): Promise<Recurrency> {
  const response = await api.put(`/recurrencies/${id}`, recurrency);
  return response.data;
}

export async function deleteRecurrency(id: string): Promise<void> {
  await api.delete(`/recurrencies/${id}`);
}

export async function pauseRecurrency(id: string): Promise<Recurrency> {
  const response = await api.patch(`/recurrencies/${id}/pause`);
  return response.data;
}

export async function activateRecurrency(id: string): Promise<Recurrency> {
  const response = await api.patch(`/recurrencies/${id}/activate`);
  return response.data;
}

export async function cancelRecurrency(id: string): Promise<Recurrency> {
  const response = await api.patch(`/recurrencies/${id}/cancel`);
  return response.data;
}

export async function generateDelivery(id: string): Promise<any> {
  const response = await api.post(`/recurrencies/${id}/generate-delivery`);
  return response.data;
}

export async function processDueToday(): Promise<any> {
  const response = await api.post('/recurrencies/process-due-today');
  return response.data;
}

export async function getCustomerRecurrencies(customerId: string, params?: Omit<RecurrencySearchParams, 'customerId'>): Promise<Recurrency[]> {
  const response = await api.get(`/recurrencies/by-customer/${customerId}`, { params });
  return response.data;
} 