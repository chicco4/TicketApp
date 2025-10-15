import { TicketStatus } from '../enums/ticket-status.enum';

export interface Ticket {
  id: string;
  eventId: string;
  eventTitle: string;
  ticketTypeId: string;
  ticketTypeName: string;
  userId: string;
  status: TicketStatus;
  purchaseDate: string;
  price: number;
  qrCode?: string;
}

export interface ListTicketResponse {
  id: string;
  eventTitle: string;
  ticketTypeName: string;
  status: TicketStatus;
  purchaseDate: string;
  eventStartDate: string;
}

export interface GetTicketResponse extends Ticket {
  eventStartDate: string;
  eventEndDate: string;
  eventLocation: string;
}
