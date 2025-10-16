import { EventType } from '../models/enums/event-type.enum';

/**
 * Maps event types to their representative images.
 * You can replace these URLs with your own images in the assets folder
 * or use different placeholder services.
 */
export const EVENT_TYPE_IMAGES: Record<EventType, string> = {
  [EventType.CONCERT]: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&h=400&fit=crop',
  [EventType.CONFERENCE]: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=400&fit=crop',
  [EventType.MEETUP]: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?w=800&h=400&fit=crop',
  [EventType.WORKSHOP]: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop',
  [EventType.FESTIVAL]: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&h=400&fit=crop',
  [EventType.SPORTS]: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&h=400&fit=crop',
  [EventType.THEATER]: 'https://images.unsplash.com/photo-1503095396549-807759245b35?w=800&h=400&fit=crop',
  [EventType.EXHIBITION]: 'https://images.unsplash.com/photo-1578926288207-a90a5366759d?w=800&h=400&fit=crop',
  [EventType.PARTY]: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=400&fit=crop',
  [EventType.OTHER]: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&h=400&fit=crop',
};

/**
 * Get the image URL for a given event type.
 * @param eventType The event type enum value
 * @returns The image URL for the event type
 */
export function getEventTypeImage(eventType: EventType | string): string {
  const type = eventType as EventType;
  return EVENT_TYPE_IMAGES[type] || EVENT_TYPE_IMAGES[EventType.OTHER];
}

/**
 * Get a fallback image URL for when no event type is specified
 */
export function getDefaultEventImage(): string {
  return EVENT_TYPE_IMAGES[EventType.OTHER];
}
