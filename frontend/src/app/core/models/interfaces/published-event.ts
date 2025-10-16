import { EventType } from '../enums/event-type.enum';
import { TicketType } from './ticket-type';

// List view of published events (simplified)
export interface PublishedEventSummary {
  id: string;
  name: string;
  start: string; // ISO datetime string
  end: string; // ISO datetime string
  venue: string;
}

// Detail view of published events (complete)
export interface PublishedEvent {
  id: string;
  name: string;
  description: string;
  type: EventType;
  start: string; // ISO datetime string
  end: string; // ISO datetime string
  venue: string;
  ticketTypes: TicketType[];
}
