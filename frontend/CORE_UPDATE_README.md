# Frontend Core Module Update

This document describes the updates made to align the frontend `/core` directory with the backend API documentation.

## Updated Structure

```
core/
├── guards/
│   └── auth-role.guard.ts (existing)
├── models/
│   ├── enums/
│   │   ├── event-status.enum.ts ✨ NEW
│   │   ├── event-type.enum.ts ✨ NEW
│   │   ├── ticket-status.enum.ts ✨ NEW
│   │   ├── ticket-validation-method.enum.ts ✨ NEW
│   │   ├── ticket-validation-status.enum.ts ✨ NEW
│   │   └── index.ts ✨ NEW
│   ├── interfaces/
│   │   ├── event.ts ✨ NEW
│   │   ├── page.ts (existing)
│   │   ├── published-event.ts ✅ UPDATED
│   │   ├── ticket.ts ✨ NEW
│   │   ├── ticket-type.ts ✅ UPDATED
│   │   ├── ticket-validation.ts ✨ NEW
│   │   └── index.ts ✨ NEW
│   └── index.ts ✨ NEW
├── services/
│   ├── events.service.ts ✨ NEW
│   ├── published-events.service.ts ✅ UPDATED
│   ├── tickets.service.ts ✨ NEW
│   ├── ticket-types.service.ts ✨ NEW
│   ├── ticket-validation.service.ts ✨ NEW
│   └── index.ts ✨ NEW
└── index.ts ✨ NEW
```

## What Was Updated

### 1. Enums (New)
All backend enums are now available as TypeScript enums:

- **EventStatus**: `DRAFT | PUBLISHED | CANCELLED | COMPLETED`
- **EventType**: `CONCERT | CONFERENCE | MEETUP | WORKSHOP | FESTIVAL | SPORTS | THEATER | EXHIBITION | PARTY | OTHER`
- **TicketStatus**: `PURCHASED | CANCELLED`
- **TicketValidationMethod**: `QR_CODE | MANUAL`
- **TicketValidationStatus**: `VALID | INVALID | EXPIRED`

### 2. Interfaces

#### New Interfaces:
- **Event**: Full event model for organizers
  - `EventCreate`: For creating new events
  - `EventUpdate`: For updating existing events
- **Ticket**: Summary ticket model for list views
- **TicketDetail**: Detailed ticket model with event information
- **TicketValidationRequest**: Request model for ticket validation
- **TicketValidationResponse**: Response model for ticket validation

#### Updated Interfaces:
- **PublishedEvent**: Now split into two interfaces:
  - `PublishedEventSummary`: For list views (simplified)
  - `PublishedEvent`: For detail views (complete with ticket types)
- **TicketType**: Enhanced with optional fields:
  - `totalAvailable`, `createdAt`, `updatedAt`
  - Added `TicketTypeCreate` and `TicketTypeUpdate` for API operations

### 3. Services

#### New Services:

**EventsService** (`events.service.ts`)
- `createEvent(event: EventCreate): Observable<Event>`
- `getEvents(options?: GetEventsOptions): Observable<Page<Event>>`
- `getEventById(id: string): Observable<Event>`
- `updateEvent(id: string, event: EventUpdate): Observable<Event>`
- `deleteEvent(id: string): Observable<void>`

**TicketsService** (`tickets.service.ts`)
- `getTickets(options?: GetTicketsOptions): Observable<Page<Ticket>>`
- `getTicketById(id: string): Observable<TicketDetail>`
- `getTicketQrCode(id: string): Observable<Blob>`
- `createQrCodeUrl(blob: Blob): string` (helper)
- `revokeQrCodeUrl(url: string): void` (helper)

**TicketTypesService** (`ticket-types.service.ts`)
- `purchaseTicket(ticketTypeId: string): Observable<TicketDetail>`

**TicketValidationService** (`ticket-validation.service.ts`)
- `validateTicket(request: TicketValidationRequest): Observable<TicketValidationResponse>`

#### Updated Services:

**PublishedEventsService** (`published-events.service.ts`)
- Added `query` parameter support to `getPublishedEvents()`
- Changed return type to use `PublishedEventSummary` for list views
- Updated base URL to use relative path `/api/v1/published-events`
- `getPublishedEventById()` returns full `PublishedEvent` with ticket types

## Usage Examples

### Import from Core Module

```typescript
// Import everything
import { 
  EventsService, 
  TicketsService, 
  EventType, 
  EventStatus 
} from '@app/core';

// Or import from specific locations
import { EventsService } from '@app/core/services';
import { EventType } from '@app/core/models/enums';
import { Event } from '@app/core/models/interfaces';
```

### Create an Event

```typescript
import { inject } from '@angular/core';
import { EventsService, EventCreate, EventStatus, EventType } from '@app/core';

export class MyComponent {
  private eventsService = inject(EventsService);

  createEvent() {
    const newEvent: EventCreate = {
      name: 'My Concert',
      description: 'A great concert',
      status: EventStatus.DRAFT,
      type: EventType.CONCERT,
      start: '2025-10-20T19:00:00',
      end: '2025-10-20T23:00:00',
      salesStart: '2025-10-01T00:00:00',
      salesEnd: '2025-10-20T18:00:00',
      venue: 'Main Arena',
      ticketTypes: [
        {
          name: 'General Admission',
          description: 'Standard entry',
          price: 50.00,
          totalAvailable: 100
        }
      ]
    };

    this.eventsService.createEvent(newEvent).subscribe(event => {
      console.log('Event created:', event);
    });
  }
}
```

### Browse Published Events

```typescript
import { inject } from '@angular/core';
import { PublishedEventsService } from '@app/core';

export class HomeComponent {
  private publishedEventsService = inject(PublishedEventsService);

  loadEvents() {
    this.publishedEventsService.getPublishedEvents({
      query: 'concert',
      page: 0,
      size: 20,
      sort: 'start,asc'
    }).subscribe(page => {
      console.log('Events:', page.content);
      console.log('Total:', page.totalElements);
    });
  }

  loadEventDetails(eventId: string) {
    this.publishedEventsService.getPublishedEventById(eventId).subscribe(event => {
      console.log('Event details:', event);
      console.log('Ticket types:', event.ticketTypes);
    });
  }
}
```

### Purchase a Ticket

```typescript
import { inject } from '@angular/core';
import { TicketTypesService } from '@app/core';

export class EventDetailsComponent {
  private ticketTypesService = inject(TicketTypesService);

  purchaseTicket(ticketTypeId: string) {
    this.ticketTypesService.purchaseTicket(ticketTypeId).subscribe(ticket => {
      console.log('Ticket purchased:', ticket);
      // Navigate to ticket details or show confirmation
    });
  }
}
```

### Display QR Code

```typescript
import { inject, signal } from '@angular/core';
import { TicketsService } from '@app/core';

export class TicketDetailsComponent {
  private ticketsService = inject(TicketsService);
  qrCodeUrl = signal<string | null>(null);

  loadQrCode(ticketId: string) {
    this.ticketsService.getTicketQrCode(ticketId).subscribe(blob => {
      const url = this.ticketsService.createQrCodeUrl(blob);
      this.qrCodeUrl.set(url);
    });
  }

  ngOnDestroy() {
    const url = this.qrCodeUrl();
    if (url) {
      this.ticketsService.revokeQrCodeUrl(url);
    }
  }
}
```

```html
<!-- In template -->
@if (qrCodeUrl(); as url) {
  <img [src]="url" alt="Ticket QR Code" />
}
```

### Validate a Ticket (Staff)

```typescript
import { inject } from '@angular/core';
import { TicketValidationService, TicketValidationMethod } from '@app/core';

export class StaffComponent {
  private validationService = inject(TicketValidationService);

  validateTicket(ticketId: string) {
    this.validationService.validateTicket({
      id: ticketId,
      method: TicketValidationMethod.QR_CODE
    }).subscribe(result => {
      console.log('Validation result:', result.status);
      // Show VALID, INVALID, or EXPIRED status to staff
    });
  }
}
```

## Breaking Changes

### PublishedEventsService
- ⚠️ **BREAKING**: `getPublishedEvents()` now returns `Page<PublishedEventSummary>` instead of `Page<PublishedEvent>`
- The summary version doesn't include `type` and `ticketTypes` fields
- Use `getPublishedEventById()` to get the full event details with ticket types

### TicketType Interface
- The `description` field is now optional (was required before)
- Added optional fields: `totalAvailable`, `createdAt`, `updatedAt`

## Configuration

### API Base URL

All services now use relative paths (e.g., `/api/v1/events`) instead of absolute URLs. Make sure your Angular proxy configuration is set up correctly:

**proxy.conf.json**:
```json
{
  "/api": {
    "target": "http://localhost:8080",
    "secure": false,
    "changeOrigin": true
  }
}
```

**angular.json**:
```json
{
  "serve": {
    "options": {
      "proxyConfig": "proxy.conf.json"
    }
  }
}
```

## Next Steps

1. ✅ Update your components to use the new services
2. ✅ Replace hardcoded event types with the `EventType` enum
3. ✅ Update any existing `PublishedEvent` usage to use `PublishedEventSummary` for lists
4. ✅ Configure your Angular proxy (see Configuration section)
5. ✅ Update your authentication to include JWT tokens in requests
6. ✅ Test all API integrations

## Additional Notes

- All services use Angular's `inject()` function for dependency injection
- All HTTP methods return `Observable` types from RxJS
- Date/time fields use ISO 8601 string format
- The QR code endpoint returns a `Blob` that needs to be converted to an object URL for display
- Remember to revoke object URLs when components are destroyed to prevent memory leaks
