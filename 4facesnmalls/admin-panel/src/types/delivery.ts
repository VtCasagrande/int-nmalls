export enum DeliveryStatus {
  PENDING = 'pending',
  ASSIGNED = 'assigned',
  IN_TRANSIT = 'in_transit',
  DELIVERED = 'delivered',
  RETURNED = 'returned',
  CANCELED = 'canceled'
}

export enum PaymentMethod {
  CASH = 'cash',
  CREDIT_CARD = 'credit_card',
  DEBIT_CARD = 'debit_card',
  PIX = 'pix',
  PREPAID = 'prepaid',
}

export interface DeliveryAddress {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  reference?: string;
}

export interface DeliveryItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
}

export interface Delivery {
  _id: string;
  code: string;
  customerId: string;
  customerName: string;
  deliveryDate: string;
  deliveryAddress: DeliveryAddress;
  items: DeliveryItem[];
  total: number;
  status: DeliveryStatus;
  deliveryFee: number;
  paymentMethod: PaymentMethod;
  notes?: string;
  driverId?: string;
  driverName?: string;
  signatureUrl?: string;
  deliveredAt?: string;
  createdAt: string;
  updatedAt: string;
} 