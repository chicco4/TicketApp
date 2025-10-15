import { TicketType } from './ticket-type';

export type EventType = 'CONCERT' | 'FESTIVAL' | 'CONFERENCE' | 'THEATER' | 'SPORT' | string;

export interface PublishedEvent {
  id: string;
  name: string;
  type?: EventType; // optional for list responses if backend omits it
  start: string; // ISO datetime string
  end: string; // ISO datetime string
  venue: string;
  ticketTypes?: TicketType[]; // present in detail endpoint
}
