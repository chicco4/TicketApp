# Event Type Images Implementation Guide

## Overview
This guide explains how event type images have been implemented in your TicketApp to display representative images for each event type in both the event cards and event detail pages.

## Changes Made

### 1. Backend Changes

#### `/backend/src/main/java/com/chicco/backend/domain/dtos/ListPublishedEventResponseDto.java`
- **Added**: `EventTypeEnum type` field
- **Reason**: The frontend needs the event type to display the appropriate image

### 2. Frontend Core Utilities

#### `/frontend/src/app/core/utils/event-type-images.ts` (NEW FILE)
A utility module that maps each event type to its representative image:

```typescript
EVENT_TYPE_IMAGES: Record<EventType, string> = {
  CONCERT: 'concert-image-url',
  CONFERENCE: 'conference-image-url',
  // ... and so on
}
```

**Current Implementation**: Uses Unsplash images (free, high-quality stock photos)

### 3. Frontend Interface Updates

#### `/frontend/src/app/core/models/interfaces/published-event.ts`
- **Added**: `type: EventType` field to `PublishedEventSummary` interface
- **Reason**: To match the updated backend DTO

### 4. Attendee Home Page (Event Cards)

#### `/frontend/src/app/pages/attendee/home/home.ts`
- **Added**: Import for `getEventTypeImage` utility
- **Added**: `getEventImage()` method to get the image URL for an event type

#### `/frontend/src/app/pages/attendee/home/home.html`
- **Added**: `<div class="event-image">` element at the top of each event card
- **Updated**: Card subtitle to include event type

#### `/frontend/src/app/pages/attendee/home/home.css`
- **Added**: `.event-image` styles (160px height, cover, centered)
- **Updated**: `.event-card` with overflow handling

### 5. Event Details Page

#### `/frontend/src/app/pages/attendee/event-details/event-details.ts`
- **Added**: Import for `getEventTypeImage` utility
- **Added**: `getEventImage()` method

#### `/frontend/src/app/pages/attendee/event-details/event-details.html`
- **Added**: `<div class="event-header-image">` banner at the top of the card

#### `/frontend/src/app/pages/attendee/event-details/event-details.css`
- **Added**: `.event-header-image` styles (300px height, full width banner)
- **Added**: Centering and max-width for the details page

## How It Works

1. Each event in your database has a `type` field (CONCERT, CONFERENCE, MEETUP, etc.)
2. When events are fetched from the backend, the type is now included in the response
3. The frontend uses the `getEventTypeImage()` function to map the type to an image URL
4. The image is displayed as a background image in a div element
5. Different styling is applied for cards (smaller) vs. detail page (larger banner)

## Customization Options

### Option 1: Use Local Images (Recommended for Production)

1. Create an `/frontend/public/assets/images/event-types/` directory
2. Add your own images for each event type:
   - `concert.jpg`
   - `conference.jpg`
   - `meetup.jpg`
   - etc.
3. Update `/frontend/src/app/core/utils/event-type-images.ts`:

```typescript
export const EVENT_TYPE_IMAGES: Record<EventType, string> = {
  [EventType.CONCERT]: '/assets/images/event-types/concert.jpg',
  [EventType.CONFERENCE]: '/assets/images/event-types/conference.jpg',
  // ... etc
};
```

### Option 2: Store Image URLs in the Database

For maximum flexibility, you could:
1. Add an `imageUrl` field to the Event entity
2. Allow organizers to upload custom images per event
3. Fall back to the type-based default if no custom image is provided

### Option 3: Use a Different Placeholder Service

Replace Unsplash URLs with:
- **Pexels**: `https://images.pexels.com/photos/...`
- **Lorem Picsum**: `https://picsum.photos/800/400`
- **Your CDN**: Store images on AWS S3, Cloudinary, etc.

### Option 4: Use Material Icons Instead

For a minimalist approach, use Material Icons:

```html
<mat-icon class="event-icon">music_note</mat-icon> <!-- for CONCERT -->
<mat-icon class="event-icon">business</mat-icon> <!-- for CONFERENCE -->
```

## Image Dimensions

- **Event Card**: 160px height, responsive width
- **Event Detail Banner**: 300px height, full width

You can adjust these in the respective CSS files.

## Performance Considerations

- **Lazy Loading**: Images load only when cards are visible
- **Caching**: Browser caches the Unsplash URLs
- **Optimization**: For production, use optimized local images (WebP format, compressed)

## Testing

After rebuilding the backend and restarting the frontend:
1. Navigate to the attendee home page
2. Each event card should display an image at the top
3. Click on an event to see the larger banner image on the detail page
4. Verify that different event types show different images

## Next Steps

1. **Rebuild the backend** to include the type field in the DTO:
   ```bash
   cd backend
   ./mvnw clean install
   ```

2. **Restart the frontend** (if not already running):
   ```bash
   cd frontend
   npm start
   ```

3. **(Optional) Replace with local images** for production use

4. **(Optional) Add image optimization** and responsive images for different screen sizes

## Troubleshooting

### Images not showing?
- Check browser console for CORS errors
- Verify that `getEventImage()` is returning valid URLs
- Ensure the `type` field is being returned from the backend

### Images loading slowly?
- Consider using a CDN
- Implement image lazy loading
- Use optimized image formats (WebP)

### Wrong images for event types?
- Verify the EventType enum values match between frontend and backend
- Check the mapping in `event-type-images.ts`
