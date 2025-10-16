import { TicketStatus } from '../enums/ticket-status.enum';
import { TicketType } from './ticket-type';

export interface Ticket {
  id: string;
  status: TicketStatus;
  ticketType: TicketType;
}

export interface TicketDetail {
  id: string;
  status: TicketStatus;
  price: number;
  description?: string;
  eventName: string;
  eventVenue: string;
  eventStart: string; // ISO datetime string
  eventEnd: string; // ISO datetime string
}
