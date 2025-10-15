export interface TicketType {
  id: string;
  eventId: string;
  name: string;
  description: string;
  price: number;
  totalQuantity: number;
  availableQuantity: number;
}

export interface CreateTicketTypeRequest {
  name: string;
  description: string;
  price: number;
  totalQuantity: number;
}

export interface UpdateTicketTypeRequest extends CreateTicketTypeRequest {
}
