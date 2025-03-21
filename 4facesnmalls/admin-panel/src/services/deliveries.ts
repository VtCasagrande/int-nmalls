import { api } from "./api";
import { Address } from "./customers";

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
  signatureDate: string;
}

export enum DeliveryStatus {
  PENDING = 'pending',
  ASSIGNED = 'assigned',
  IN_TRANSIT = 'in_transit',
  DELIVERED = 'delivered',
  RETURNED = 'returned',
  CANCELLED = 'cancelled',
}

export enum PaymentMethod {
  CASH = 'cash',
  CREDIT_CARD = 'credit_card',
  DEBIT_CARD = 'debit_card',
  PIX = 'pix',
  BANK_TRANSFER = 'bank_transfer',
  ALREADY_PAID = 'already_paid',
}

export interface Delivery {
  _id: string;
  customer: any;
  deliveryPerson?: any;
  status: DeliveryStatus;
  deliveryAddress: Address;
  items: DeliveryItem[];
  scheduledDate?: string;
  deliveredAt?: string;
  totalValue: number;
  deliveryFee: number;
  paymentMethod: PaymentMethod;
  isPaid: boolean;
  notes?: string;
  externalOrderNumber?: string;
  signature?: DeliverySignature;
  statusHistory: Array<{ status: string; date: string; by: string }>;
  lastLocation?: { lat: number; lng: number };
  recurrencyId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDeliveryDTO {
  customer: string;
  deliveryPerson?: string;
  status?: DeliveryStatus;
  deliveryAddress: Omit<Address, '_id' | 'isMain'>;
  items: DeliveryItem[];
  scheduledDate?: string;
  totalValue?: number;
  deliveryFee?: number;
  paymentMethod?: PaymentMethod;
  isPaid?: boolean;
  notes?: string;
  externalOrderNumber?: string;
  recurrencyId?: string;
}

export interface DeliverySearchParams {
  status?: DeliveryStatus;
  scheduledDate?: string;
  deliveredAt?: string;
  externalOrderNumber?: string;
  paymentMethod?: PaymentMethod;
  isPaid?: boolean;
  recurrencyId?: string;
  limit?: number;
  skip?: number;
}

export async function getDeliveries(params?: DeliverySearchParams): Promise<Delivery[]> {
  const response = await api.get('/deliveries', { params });
  return response.data;
}

export async function getDeliveryById(id: string): Promise<Delivery> {
  const response = await api.get(`/deliveries/${id}`);
  return response.data;
}

export async function createDelivery(delivery: CreateDeliveryDTO): Promise<Delivery> {
  const response = await api.post('/deliveries', delivery);
  return response.data;
}

export async function updateDelivery(id: string, delivery: Partial<CreateDeliveryDTO>): Promise<Delivery> {
  const response = await api.put(`/deliveries/${id}`, delivery);
  return response.data;
}

export async function deleteDelivery(id: string): Promise<void> {
  await api.delete(`/deliveries/${id}`);
}

export async function assignDeliveryPerson(id: string, deliveryPersonId: string): Promise<Delivery> {
  const response = await api.post(`/deliveries/${id}/assign/${deliveryPersonId}`);
  return response.data;
}

export async function addSignature(id: string, signatureData: Omit<DeliverySignature, 'signatureDate'>): Promise<Delivery> {
  const response = await api.post(`/deliveries/${id}/signature`, signatureData);
  return response.data;
}

export async function updateLocation(id: string, location: { lat: number; lng: number }): Promise<Delivery> {
  const response = await api.post(`/deliveries/${id}/location`, location);
  return response.data;
}

export async function getCustomerDeliveries(customerId: string, params?: Omit<DeliverySearchParams, 'customerId'>): Promise<Delivery[]> {
  const response = await api.get(`/deliveries/by-customer/${customerId}`, { params });
  return response.data;
}

export async function getDeliveryPersonDeliveries(deliveryPersonId: string, params?: Omit<DeliverySearchParams, 'deliveryPersonId'>): Promise<Delivery[]> {
  const response = await api.get(`/deliveries/by-delivery-person/${deliveryPersonId}`, { params });
  return response.data;
} 