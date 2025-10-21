import { EventStatus } from '../enums/event-status.enum';
import { EventType } from '../enums/event-type.enum';
import { TicketType, TicketTypeCreate, TicketTypeUpdate } from './ticket-type';

export interface Event {
  id: string;
  name: string;
  description?: string;
  status: EventStatus;
  type: EventType;
  start: string; // ISO datetime string
  end: string; // ISO datetime string
  salesStart?: string; // ISO datetime string
  salesEnd?: string; // ISO datetime string
  venue: string;
  ticketTypes: TicketType[];
  createdAt?: string;
  updatedAt?: string;
}

export interface EventCreate {
  name: string;
  description?: string;
  status: EventStatus;
  type: EventType;
  start: string;
  end: string;
  salesStart?: string;
  salesEnd?: string;
  venue: string;
  ticketTypes: TicketTypeCreate[];
}

export interface EventUpdate {
  id: string;
  name: string;
  description?: string;
  status: EventStatus;
  type: EventType;
  start: string;
  end: string;
  salesStart?: string;
  salesEnd?: string;
  venue: string;
  ticketTypes: TicketTypeUpdate[];
}
