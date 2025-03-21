import { api } from "./api";

export interface Address {
  _id?: string;
  zipCode: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  reference?: string;
  isMain?: boolean;
}

export interface Customer {
  _id: string;
  name: string;
  email?: string;
  phone: string;
  alternativePhone?: string;
  type: 'individual' | 'company';
  cpf?: string;
  cnpj?: string;
  addresses: Address[];
  isActive: boolean;
  notes?: string;
  birthDate?: string;
  deliveries?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateCustomerDTO {
  name: string;
  email?: string;
  phone: string;
  alternativePhone?: string;
  type?: 'individual' | 'company';
  cpf?: string;
  cnpj?: string;
  addresses?: Address[];
  notes?: string;
  birthDate?: string;
}

export interface CustomerSearchParams {
  name?: string;
  email?: string;
  phone?: string;
  type?: string;
  cpf?: string;
  cnpj?: string;
  isActive?: boolean;
  limit?: number;
  skip?: number;
}

export async function getCustomers(params?: CustomerSearchParams): Promise<Customer[]> {
  const response = await api.get('/customers', { params });
  return response.data;
}

export async function getCustomerById(id: string): Promise<Customer> {
  const response = await api.get(`/customers/${id}`);
  return response.data;
}

export async function createCustomer(customer: CreateCustomerDTO): Promise<Customer> {
  const response = await api.post('/customers', customer);
  return response.data;
}

export async function updateCustomer(id: string, customer: Partial<CreateCustomerDTO>): Promise<Customer> {
  const response = await api.put(`/customers/${id}`, customer);
  return response.data;
}

export async function deleteCustomer(id: string): Promise<void> {
  await api.delete(`/customers/${id}`);
}

export async function addAddress(customerId: string, address: Address): Promise<Customer> {
  const response = await api.post(`/customers/${customerId}/addresses`, address);
  return response.data;
}

export async function updateAddress(customerId: string, addressId: string, address: Partial<Address>): Promise<Customer> {
  const response = await api.put(`/customers/${customerId}/addresses/${addressId}`, address);
  return response.data;
}

export async function removeAddress(customerId: string, addressId: string): Promise<Customer> {
  const response = await api.delete(`/customers/${customerId}/addresses/${addressId}`);
  return response.data;
} 