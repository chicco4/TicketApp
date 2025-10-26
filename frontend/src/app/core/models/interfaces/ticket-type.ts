export interface TicketType {
  id: string;
  name: string;
  description?: string;
  price: number;
  totalAvailable?: number | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface TicketTypeCreate {
  name: string;
  description?: string;
  price: number;
  totalAvailable?: number | null;
}

export interface TicketTypeUpdate {
  id?: string;
  name: string;
  description?: string;
  price: number;
  totalAvailable?: number | null;
}
