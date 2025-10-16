# TicketApp API Documentation

## Base URL
`/api/v1`

---

## Table of Contents
1. [Event Management APIs](#event-management-apis)
2. [Published Events APIs](#published-events-apis)
3. [Ticket Management APIs](#ticket-management-apis)
4. [Ticket Type APIs](#ticket-type-apis)
5. [Ticket Validation APIs](#ticket-validation-apis)
6. [Enums Reference](#enums-reference)

---

## Event Management APIs
**Base Path:** `/api/v1/events`

**Authentication Required:** Yes (JWT)

### 1. Create Event
**Endpoint:** `POST /api/v1/events`

**Request Body:**
```json
{
  "name": "string",
  "description": "string",
  "status": "DRAFT | PUBLISHED | CANCELLED | COMPLETED",
  "type": "CONCERT | CONFERENCE | MEETUP | WORKSHOP | FESTIVAL | SPORTS | THEATER | EXHIBITION | PARTY | OTHER",
  "start": "2025-10-20T19:00:00",
  "end": "2025-10-20T23:00:00",
  "salesStart": "2025-10-01T00:00:00",
  "salesEnd": "2025-10-20T18:00:00",
  "venue": "string",
  "ticketTypes": [
    {
      "name": "string",
      "description": "string",
      "price": 0.0,
      "totalAvailable": 100
    }
  ]
}
```

**Validation:**
- `name`: Required, not blank
- `status`: Required
- `type`: Required
- `venue`: Required, not blank
- `ticketTypes`: Required, at least one ticket type
- `ticketTypes[].name`: Required, not blank
- `ticketTypes[].price`: Required, must be zero or greater

**Response:** `201 Created`
```json
{
  "id": "uuid",
  "name": "string",
  "description": "string",
  "status": "DRAFT | PUBLISHED | CANCELLED | COMPLETED",
  "type": "CONCERT | CONFERENCE | MEETUP | WORKSHOP | FESTIVAL | SPORTS | THEATER | EXHIBITION | PARTY | OTHER",
  "start": "2025-10-20T19:00:00",
  "end": "2025-10-20T23:00:00",
  "salesStart": "2025-10-01T00:00:00",
  "salesEnd": "2025-10-20T18:00:00",
  "venue": "string",
  "ticketTypes": [
    {
      "id": "uuid",
      "name": "string",
      "description": "string",
      "price": 0.0,
      "totalAvailable": 100,
      "createdAt": "2025-10-16T10:00:00",
      "updatedAt": "2025-10-16T10:00:00"
    }
  ],
  "createdAt": "2025-10-16T10:00:00",
  "updatedAt": "2025-10-16T10:00:00"
}
```

---

### 2. List Events (Paginated)
**Endpoint:** `GET /api/v1/events`

**Query Parameters:**
- `page`: Page number (default: 0)
- `size`: Page size (default: 20)
- `sort`: Sort field and direction (e.g., `name,asc`)

**Response:** `200 OK`
```json
{
  "content": [
    {
      "id": "uuid",
      "name": "string",
      "status": "DRAFT | PUBLISHED | CANCELLED | COMPLETED",
      "type": "CONCERT | CONFERENCE | MEETUP | WORKSHOP | FESTIVAL | SPORTS | THEATER | EXHIBITION | PARTY | OTHER",
      "start": "2025-10-20T19:00:00",
      "end": "2025-10-20T23:00:00",
      "salesStart": "2025-10-01T00:00:00",
      "salesEnd": "2025-10-20T18:00:00",
      "venue": "string",
      "ticketTypes": [
        {
          "id": "uuid",
          "name": "string",
          "description": "string",
          "price": 0.0,
          "totalAvailable": 100
        }
      ]
    }
  ],
  "pageable": {
    "sort": {
      "sorted": true,
      "unsorted": false,
      "empty": false
    },
    "pageNumber": 0,
    "pageSize": 20,
    "offset": 0,
    "paged": true,
    "unpaged": false
  },
  "totalPages": 5,
  "totalElements": 100,
  "last": false,
  "size": 20,
  "number": 0,
  "sort": {
    "sorted": true,
    "unsorted": false,
    "empty": false
  },
  "numberOfElements": 20,
  "first": true,
  "empty": false
}
```

---

### 3. Get Event Details
**Endpoint:** `GET /api/v1/events/{event-id}`

**Path Parameters:**
- `event-id`: UUID of the event

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "name": "string",
  "status": "DRAFT | PUBLISHED | CANCELLED | COMPLETED",
  "type": "CONCERT | CONFERENCE | MEETUP | WORKSHOP | FESTIVAL | SPORTS | THEATER | EXHIBITION | PARTY | OTHER",
  "start": "2025-10-20T19:00:00",
  "end": "2025-10-20T23:00:00",
  "salesStart": "2025-10-01T00:00:00",
  "salesEnd": "2025-10-20T18:00:00",
  "venue": "string",
  "ticketTypes": [
    {
      "id": "uuid",
      "name": "string",
      "description": "string",
      "price": 0.0,
      "totalAvailable": 100,
      "createdAt": "2025-10-16T10:00:00",
      "updatedAt": "2025-10-16T10:00:00"
    }
  ],
  "createdAt": "2025-10-16T10:00:00",
  "updatedAt": "2025-10-16T10:00:00"
}
```

**Error Response:** `404 Not Found`

---

### 4. Update Event
**Endpoint:** `PUT /api/v1/events/{event-id}`

**Path Parameters:**
- `event-id`: UUID of the event

**Request Body:**
```json
{
  "id": "uuid",
  "name": "string",
  "description": "string",
  "status": "DRAFT | PUBLISHED | CANCELLED | COMPLETED",
  "type": "CONCERT | CONFERENCE | MEETUP | WORKSHOP | FESTIVAL | SPORTS | THEATER | EXHIBITION | PARTY | OTHER",
  "start": "2025-10-20T19:00:00",
  "end": "2025-10-20T23:00:00",
  "salesStart": "2025-10-01T00:00:00",
  "salesEnd": "2025-10-20T18:00:00",
  "venue": "string",
  "ticketTypes": [
    {
      "id": "uuid",
      "name": "string",
      "description": "string",
      "price": 0.0,
      "totalAvailable": 100
    }
  ]
}
```

**Validation:**
- `id`: Required
- `name`: Required, not blank
- `status`: Required
- `type`: Required
- `venue`: Required, not blank
- `ticketTypes`: Required, at least one ticket type
- `ticketTypes[].name`: Required, not blank
- `ticketTypes[].price`: Required, must be zero or greater

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "name": "string",
  "description": "string",
  "status": "DRAFT | PUBLISHED | CANCELLED | COMPLETED",
  "type": "CONCERT | CONFERENCE | MEETUP | WORKSHOP | FESTIVAL | SPORTS | THEATER | EXHIBITION | PARTY | OTHER",
  "start": "2025-10-20T19:00:00",
  "end": "2025-10-20T23:00:00",
  "salesStart": "2025-10-01T00:00:00",
  "salesEnd": "2025-10-20T18:00:00",
  "venue": "string",
  "ticketTypes": [
    {
      "id": "uuid",
      "name": "string",
      "description": "string",
      "price": 0.0,
      "totalAvailable": 100,
      "createdAt": "2025-10-16T10:00:00",
      "updatedAt": "2025-10-16T10:00:00"
    }
  ],
  "createdAt": "2025-10-16T10:00:00",
  "updatedAt": "2025-10-16T10:00:00"
}
```

---

### 5. Delete Event
**Endpoint:** `DELETE /api/v1/events/{event-id}`

**Path Parameters:**
- `event-id`: UUID of the event

**Response:** `204 No Content`

---

## Published Events APIs
**Base Path:** `/api/v1/published-events`

**Authentication Required:** No

### 1. List Published Events (Paginated)
**Endpoint:** `GET /api/v1/published-events`

**Query Parameters:**
- `query`: Optional search query string
- `page`: Page number (default: 0)
- `size`: Page size (default: 20)
- `sort`: Sort field and direction (e.g., `name,asc`)

**Response:** `200 OK`
```json
{
  "content": [
    {
      "id": "uuid",
      "name": "string",
      "description": "string",
      "start": "2025-10-20T19:00:00",
      "end": "2025-10-20T23:00:00",
      "venue": "string"
    }
  ],
  "pageable": {
    "sort": {
      "sorted": true,
      "unsorted": false,
      "empty": false
    },
    "pageNumber": 0,
    "pageSize": 20,
    "offset": 0,
    "paged": true,
    "unpaged": false
  },
  "totalPages": 5,
  "totalElements": 100,
  "last": false,
  "size": 20,
  "number": 0,
  "sort": {
    "sorted": true,
    "unsorted": false,
    "empty": false
  },
  "numberOfElements": 20,
  "first": true,
  "empty": false
}
```

---

### 2. Get Published Event Details
**Endpoint:** `GET /api/v1/published-events/{event-id}`

**Path Parameters:**
- `event-id`: UUID of the event

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "name": "string",
  "type": "CONCERT | CONFERENCE | MEETUP | WORKSHOP | FESTIVAL | SPORTS | THEATER | EXHIBITION | PARTY | OTHER",
  "start": "2025-10-20T19:00:00",
  "end": "2025-10-20T23:00:00",
  "venue": "string",
  "ticketTypes": [
    {
      "id": "uuid",
      "name": "string",
      "description": "string",
      "price": 0.0
    }
  ]
}
```

**Error Response:** `404 Not Found`

---

## Ticket Management APIs
**Base Path:** `/api/v1/tickets`

**Authentication Required:** Yes (JWT)

### 1. List Tickets (Paginated)
**Endpoint:** `GET /api/v1/tickets`

**Query Parameters:**
- `page`: Page number (default: 0)
- `size`: Page size (default: 20)
- `sort`: Sort field and direction (e.g., `createdAt,desc`)

**Response:** `200 OK`
```json
{
  "content": [
    {
      "id": "uuid",
      "status": "PURCHASED | CANCELLED",
      "ticketType": {
        "id": "uuid",
        "name": "string",
        "price": 0.0
      }
    }
  ],
  "pageable": {
    "sort": {
      "sorted": true,
      "unsorted": false,
      "empty": false
    },
    "pageNumber": 0,
    "pageSize": 20,
    "offset": 0,
    "paged": true,
    "unpaged": false
  },
  "totalPages": 5,
  "totalElements": 100,
  "last": false,
  "size": 20,
  "number": 0,
  "sort": {
    "sorted": true,
    "unsorted": false,
    "empty": false
  },
  "numberOfElements": 20,
  "first": true,
  "empty": false
}
```

---

### 2. Get Ticket Details
**Endpoint:** `GET /api/v1/tickets/{ticket-id}`

**Path Parameters:**
- `ticket-id`: UUID of the ticket

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "status": "PURCHASED | CANCELLED",
  "price": 0.0,
  "description": "string",
  "eventName": "string",
  "eventVenue": "string",
  "eventStart": "2025-10-20T19:00:00",
  "eventEnd": "2025-10-20T23:00:00"
}
```

**Error Response:** `404 Not Found`

---

### 3. Get Ticket QR Code
**Endpoint:** `GET /api/v1/tickets/{ticket-id}/qr-code`

**Path Parameters:**
- `ticket-id`: UUID of the ticket

**Response:** `200 OK`
- **Content-Type:** `image/png`
- **Body:** Binary PNG image data

**Headers:**
```
Content-Type: image/png
Content-Length: <size-in-bytes>
```

---

## Ticket Type APIs
**Base Path:** `/api/v1/ticket-types`

**Authentication Required:** Yes (JWT)

### 1. Purchase Ticket
**Endpoint:** `POST /api/v1/ticket-types/{ticket-type-id}`

**Path Parameters:**
- `ticket-type-id`: UUID of the ticket type to purchase

**Response:** `201 Created`
```json
{
  "id": "uuid",
  "status": "PURCHASED",
  "price": 0.0,
  "description": "string",
  "eventName": "string",
  "eventVenue": "string",
  "eventStart": "2025-10-20T19:00:00",
  "eventEnd": "2025-10-20T23:00:00"
}
```

**Headers:**
```
Location: /api/v1/tickets/{ticket-id}
```

**Possible Errors:**
- `404 Not Found`: Ticket type not found
- `400 Bad Request`: Ticket sold out or event not available for purchase

---

## Ticket Validation APIs
**Base Path:** `/api/v1/ticket-validations`

**Authentication Required:** Yes (JWT - Staff role)

### 1. Validate Ticket
**Endpoint:** `POST /api/v1/ticket-validations`

**Request Body:**
```json
{
  "id": "uuid",
  "method": "QR_CODE | MANUAL"
}
```

**Response:** `200 OK`
```json
{
  "ticketId": "uuid",
  "status": "VALID | INVALID | EXPIRED"
}
```

**Validation Methods:**
- `QR_CODE`: Validates ticket using QR code scan
- `MANUAL`: Validates ticket manually by ticket ID

**Validation Statuses:**
- `VALID`: Ticket is valid and can be used
- `INVALID`: Ticket is not valid (already used, cancelled, or doesn't exist)
- `EXPIRED`: Ticket has expired

---

## Enums Reference

### EventStatusEnum
```
DRAFT
PUBLISHED
CANCELLED
COMPLETED
```

### EventTypeEnum
```
CONCERT
CONFERENCE
MEETUP
WORKSHOP
FESTIVAL
SPORTS
THEATER
EXHIBITION
PARTY
OTHER
```

### TicketStatusEnum
```
PURCHASED
CANCELLED
```

### TicketValidationMethodEnum
```
QR_CODE
MANUAL
```

### TicketValidationStatusEnum
```
VALID
INVALID
EXPIRED
```

---

## Error Responses

All error responses follow this format:

**Response:** `4xx` or `5xx`
```json
{
  "error": "Error message describing what went wrong"
}
```

### Common HTTP Status Codes
- `200 OK`: Request succeeded
- `201 Created`: Resource created successfully
- `204 No Content`: Request succeeded with no response body
- `400 Bad Request`: Invalid request data
- `401 Unauthorized`: Authentication required
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error

---

## Authentication

Most endpoints require JWT authentication. Include the JWT token in the `Authorization` header:

```
Authorization: Bearer <jwt-token>
```

The JWT token should contain:
- User ID in the subject (`sub`) claim
- User roles/authorities

---

## Pagination

All paginated endpoints support the following query parameters:

- `page`: Zero-based page number (default: 0)
- `size`: Number of items per page (default: 20)
- `sort`: Sort field and direction (e.g., `name,asc` or `createdAt,desc`)

Multiple sort parameters can be provided for multi-field sorting.

---

## Date/Time Format

All timestamps use ISO 8601 format:
```
YYYY-MM-DDTHH:mm:ss
```

Example: `2025-10-20T19:00:00`

---

## Notes

1. **User Context**: All authenticated endpoints extract the user ID from the JWT token automatically
2. **Organizer Access**: Event management endpoints are restricted to the event organizer (creator)
3. **Public Access**: Published events endpoints are publicly accessible without authentication
4. **Staff Access**: Ticket validation endpoints require staff role
5. **QR Code Generation**: QR codes are generated automatically when tickets are purchased
6. **Ticket Purchase**: Creates a ticket linked to the authenticated user and selected ticket type
