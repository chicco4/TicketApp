# TicketApp - Project Documentation

## Table of Contents
1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Technology Stack](#technology-stack)
4. [System Components](#system-components)
5. [Domain Model](#domain-model)
6. [Security & Authentication](#security--authentication)
7. [API Endpoints](#api-endpoints)
8. [Setup & Running](#setup--running)
9. [Data Flow](#data-flow)
10. [Key Features](#key-features)

---

## Overview

TicketApp is an **Event Ticket Platform** that enables event organizers to create and manage events, sell tickets, and validate ticket entries. The platform supports multiple user roles (Organizers, Attendees, and Staff) with role-based access control through Keycloak OAuth2/JWT authentication.

### Core Capabilities
- **Event Management**: Create, update, and publish events with detailed information
- **Ticket Sales**: Multiple ticket types per event with inventory management
- **QR Code Generation**: Automatic QR code generation for digital tickets
- **Ticket Validation**: Staff can validate tickets via QR code scanning or manual entry
- **Role-Based Access**: Different permissions for Organizers, Attendees, and Staff

---

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend                              │
│                    (Angular 20.x)                            │
│              http://localhost:4200                           │
└──────────────────────┬──────────────────────────────────────┘
                       │ REST API (JSON)
                       │ JWT Bearer Token
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                      Backend API                             │
│                 (Spring Boot 3.5.6)                          │
│                  http://localhost:8080                       │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Controllers → Services → Repositories → Database   │   │
│  └─────────────────────────────────────────────────────┘   │
└──────────────┬───────────────────────────┬──────────────────┘
               │                           │
               │                           │
               ▼                           ▼
┌──────────────────────────┐   ┌─────────────────────────┐
│   PostgreSQL Database    │   │   Keycloak (OAuth2)     │
│   localhost:5432         │   │   localhost:9090        │
│   - Events               │   │   - User Management     │
│   - Tickets              │   │   - JWT Tokens          │
│   - Users                │   │   - Role Management     │
│   - Validations          │   └─────────────────────────┘
└──────────────────────────┘
```

### Project Structure

```
TicketApp/
├── backend/                 # Spring Boot API
│   ├── src/main/java/com/chicco/backend/
│   │   ├── config/         # Configuration classes
│   │   ├── controllers/    # REST API endpoints
│   │   ├── domain/         # Domain models & DTOs
│   │   ├── exceptions/     # Custom exceptions
│   │   ├── filters/        # Security filters
│   │   ├── mappers/        # MapStruct entity-DTO mappers
│   │   ├── repositories/   # JPA repositories
│   │   ├── services/       # Business logic
│   │   └── util/           # Utility classes
│   ├── src/main/resources/
│   │   └── application.properties
│   └── docker-compose.yml  # Infrastructure services
│
└── frontend/               # Angular application
    └── src/app/           # Angular components & services
```

---

## Technology Stack

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| **Java** | 21 | Programming language |
| **Spring Boot** | 3.5.6 | Application framework |
| **Spring Data JPA** | 3.5.6 | Database access |
| **Spring Security** | 3.5.6 | Security & OAuth2 resource server |
| **PostgreSQL** | Latest | Primary database |
| **Keycloak** | Latest | Identity & access management |
| **MapStruct** | 1.6.3 | Object mapping |
| **Lombok** | 1.18.36 | Boilerplate code reduction |
| **ZXing** | 3.5.2 | QR code generation |
| **SpringDoc OpenAPI** | 2.8.11 | API documentation |
| **Maven** | 3.x | Build tool |

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| **Angular** | 20.x | Frontend framework |
| **Angular Material** | 20.2.8 | UI components |
| **TypeScript** | 5.8.2 | Programming language |
| **RxJS** | 7.8.0 | Reactive programming |

### Infrastructure
- **Docker Compose**: Container orchestration for PostgreSQL, Keycloak, and Adminer
- **Adminer**: Database management UI (port 8888)

---

## System Components

### 1. Configuration Layer (`config/`)

#### `SecurityConfig.java`
- Configures Spring Security with OAuth2 JWT authentication
- Defines role-based access control rules:
  - **ORGANIZER**: Access to `/api/v1/events/**`
  - **STAFF**: Access to `/api/v1/ticket-validations/**`
  - **Public**: Access to `/api/v1/published-events/**`
- CORS configuration for frontend integration
- Stateless session management

#### `JwtAuthenticationConverter.java`
- Extracts roles from Keycloak JWT tokens
- Converts Keycloak realm roles to Spring Security authorities
- Maps roles with `ROLE_` prefix for Spring Security

#### `JpaConfiguration.java`
- Configures JPA auditing for automatic timestamp management
- Enables `createdAt` and `updatedAt` fields in entities

#### `QrCodeConfig.java`
- Configuration for QR code generation
- Sets QR code dimensions and image format

#### `OpenApiConfig.java`
- Configures Swagger/OpenAPI documentation
- API documentation available at `/api/v1/docs/ui`

### 2. Controllers Layer (`controllers/`)

REST API endpoints following RESTful principles:

#### `EventController.java`
- **POST** `/api/v1/events` - Create new event (Organizer)
- **GET** `/api/v1/events` - List organizer's events (Paginated)
- **GET** `/api/v1/events/{event-id}` - Get event details
- **PUT** `/api/v1/events/{event-id}` - Update event
- **DELETE** `/api/v1/events/{event-id}` - Delete event

#### `PublishedEventController.java`
- **GET** `/api/v1/published-events` - List all published events (Public)
- **GET** `/api/v1/published-events/search` - Search published events
- **GET** `/api/v1/published-events/{event-id}` - Get published event details

#### `TicketController.java`
- **POST** `/api/v1/tickets` - Purchase ticket (Attendee)
- **GET** `/api/v1/tickets` - List user's tickets
- **GET** `/api/v1/tickets/{ticket-id}` - Get ticket details
- **GET** `/api/v1/tickets/{ticket-id}/qr` - Get ticket QR code

#### `TicketTypeController.java`
- **POST** `/api/v1/events/{event-id}/ticket-types` - Create ticket type
- **PUT** `/api/v1/events/{event-id}/ticket-types/{ticket-type-id}` - Update ticket type
- **DELETE** `/api/v1/events/{event-id}/ticket-types/{ticket-type-id}` - Delete ticket type

#### `TicketValidationController.java`
- **POST** `/api/v1/ticket-validations` - Validate ticket (Staff)
  - Supports QR code scanning or manual ID entry

#### `GlobalExceptionHandler.java`
- Centralized exception handling
- Returns standardized error responses

### 3. Domain Layer (`domain/`)

#### Entities (`domain/entities/`)

**`Event.java`**
- Primary entity for event management
- Fields: name, description, status, type, start/end times, sales period, venue
- Relationships:
  - `ManyToOne` with User (organizer)
  - `ManyToMany` with User (attendees, staff)
  - `OneToMany` with TicketType
- Statuses: DRAFT, PUBLISHED, CANCELLED, COMPLETED
- Types: CONFERENCE, CONCERT, SPORTS, etc.

**`TicketType.java`**
- Defines ticket categories for an event
- Fields: name, description, price, totalAvailable
- Relationships:
  - `ManyToOne` with Event
  - `OneToMany` with Ticket

**`Ticket.java`**
- Represents individual purchased tickets
- Fields: status, qrValue (Base64 PNG QR code)
- Relationships:
  - `ManyToOne` with TicketType
  - `ManyToOne` with User (purchaser)
  - `OneToMany` with TicketValidation
- Statuses: VALID, USED, CANCELLED, EXPIRED

**`TicketValidation.java`**
- Records ticket validation events
- Fields: method (QR_CODE/MANUAL), status (VALID/INVALID)
- Relationships:
  - `ManyToOne` with Ticket
  - `ManyToOne` with User (validatedBy)

**`User.java`**
- User entity synchronized with Keycloak
- Fields: id (from Keycloak), username, email, password
- Relationships:
  - `OneToMany` with Event (organizedEvents)
  - `ManyToMany` with Event (attendingEvents, staffingEvents)
  - `OneToMany` with Ticket (purchasedTickets)
  - `OneToMany` with TicketValidation (validations)

**`Log.java`** (Base class)
- Abstract entity providing audit fields
- Fields: createdAt, updatedAt (auto-managed by JPA auditing)

#### DTOs (`domain/dtos/`)
- Request/Response DTOs for each endpoint
- Separates API contracts from database entities
- Validation annotations (@Valid, @NotNull, etc.)

#### Mappers (`mappers/`)
- MapStruct interfaces for entity-DTO conversion
- `EventMapper`, `TicketMapper`, `TicketValidationMapper`
- Automatic implementation generation at compile time

### 4. Service Layer (`services/`)

Business logic implementation:

#### `EventService` & Implementation
- Event creation and management
- Event publishing workflow
- Search and filtering
- Authorization checks (user owns event)

#### `TicketService` & Implementation
- Ticket purchasing logic
- Inventory management (sold-out checking)
- QR code generation for tickets
- Ticket retrieval and listing

#### `TicketTypeService` & Implementation
- Ticket type CRUD operations
- Validation of ticket type updates
- Association with events

#### `TicketValidationService` & Implementation
- Ticket validation logic (QR code or manual)
- Validation status tracking
- Duplicate validation prevention
- Authorization checks (staff for specific event)

### 5. Repository Layer (`repositories/`)

JPA repositories extending `JpaRepository`:
- `EventRepository` - Event queries and filtering
- `TicketRepository` - Ticket queries
- `TicketTypeRepository` - Ticket type queries
- `TicketValidationRepository` - Validation history
- `UserRepository` - User queries

Custom query methods using Spring Data JPA naming conventions.

### 6. Security & Filters

#### `UserProvisioningFilter.java`
- Intercepts authenticated requests
- Automatically creates/updates User entities from Keycloak JWT
- Ensures local user record exists for relationships

#### `JwtUtil.java`
- Utility for parsing user ID from JWT tokens
- Extracts subject claim and converts to UUID

---

## Domain Model

### Entity Relationship Diagram

```
┌──────────────┐
│     User     │
│──────────────│
│ id (UUID)    │◄──────────┐
│ username     │           │
│ email        │           │
│ password     │           │
└──────┬───────┘           │
       │                   │
       │ organizer         │ attendees/staff
       │ (1:N)             │ (M:N)
       │                   │
       ▼                   │
┌──────────────┐           │
│    Event     │───────────┘
│──────────────│
│ id (UUID)    │
│ name         │
│ description  │
│ status       │◄─── DRAFT, PUBLISHED, CANCELLED, COMPLETED
│ type         │◄─── CONFERENCE, CONCERT, SPORTS, etc.
│ start        │
│ end          │
│ salesStart   │
│ salesEnd     │
│ venue        │
└──────┬───────┘
       │
       │ (1:N)
       │
       ▼
┌─────────────────┐
│   TicketType    │
│─────────────────│
│ id (UUID)       │
│ name            │
│ description     │
│ price           │
│ totalAvailable  │
└──────┬──────────┘
       │
       │ (1:N)
       │
       ▼
┌──────────────────┐       ┌────────────────────┐
│     Ticket       │       │ TicketValidation   │
│──────────────────│       │────────────────────│
│ id (UUID)        │◄──────┤ id (UUID)          │
│ status           │ (1:N) │ method             │◄─── QR_CODE, MANUAL
│ qrValue (Base64) │       │ status             │◄─── VALID, INVALID
│ purchaser ───────┼───────┤ validatedBy ───────┼─────► User
└──────────────────┘       │ createdAt          │
                           └────────────────────┘
```

### Enumerations

- **EventStatusEnum**: DRAFT, PUBLISHED, CANCELLED, COMPLETED
- **EventTypeEnum**: CONFERENCE, CONCERT, SPORTS, WORKSHOP, etc.
- **TicketStatusEnum**: VALID, USED, CANCELLED, EXPIRED
- **TicketValidationMethodEnum**: QR_CODE, MANUAL
- **TicketValidationStatusEnum**: VALID, INVALID

---

## Security & Authentication

### Authentication Flow

1. **User Login**: User authenticates via Keycloak
2. **JWT Token**: Keycloak issues JWT access token
3. **API Request**: Frontend sends request with `Authorization: Bearer <token>`
4. **Token Validation**: Spring Security validates JWT signature and issuer
5. **Role Extraction**: Custom converter extracts roles from JWT
6. **User Provisioning**: Filter creates/updates local User entity
7. **Authorization**: Access granted based on role and endpoint

### Keycloak Configuration

**Realm**: `event-ticket-platform`  
**Client**: `event-ticket-platform-app`  
**URL**: `http://localhost:9090`

#### Test Users

| Username | Password | Role |
|----------|----------|------|
| organizer1 | password | ORGANIZER |
| attendee1 | password | ATTENDEE |
| staff1 | password | STAFF |

#### Token Endpoint
```
POST http://localhost:9090/realms/event-ticket-platform/protocol/openid-connect/token

Body (form-urlencoded):
grant_type=password
client_id=event-ticket-platform-app
username=organizer1
password=password
```

### Role-Based Access Control

| Role | Permissions |
|------|-------------|
| **ORGANIZER** | Create/manage events, create ticket types, view sales |
| **ATTENDEE** | Browse events, purchase tickets, view owned tickets |
| **STAFF** | Validate tickets for assigned events |
| **Public** | View published events (no authentication required) |

---

## API Endpoints

### Public Endpoints

```
GET  /api/v1/published-events           # List published events (paginated)
GET  /api/v1/published-events/search    # Search published events
GET  /api/v1/published-events/{id}      # Get event details
GET  /api/v1/docs                        # OpenAPI JSON/YAML
GET  /api/v1/docs/ui                     # Swagger UI
```

### Organizer Endpoints (Requires `ROLE_ORGANIZER`)

```
POST   /api/v1/events                    # Create event
GET    /api/v1/events                    # List my events
GET    /api/v1/events/{id}               # Get event details
PUT    /api/v1/events/{id}               # Update event
DELETE /api/v1/events/{id}               # Delete event

POST   /api/v1/events/{id}/ticket-types          # Create ticket type
PUT    /api/v1/events/{id}/ticket-types/{typeId} # Update ticket type
DELETE /api/v1/events/{id}/ticket-types/{typeId} # Delete ticket type
```

### Attendee Endpoints (Requires Authentication)

```
POST /api/v1/tickets                     # Purchase ticket
GET  /api/v1/tickets                     # List my tickets
GET  /api/v1/tickets/{id}                # Get ticket details
GET  /api/v1/tickets/{id}/qr             # Get QR code image
```

### Staff Endpoints (Requires `ROLE_STAFF`)

```
POST /api/v1/ticket-validations          # Validate ticket
```

---

## Setup & Running

### Prerequisites
- Java 21
- Maven 3.x
- Docker & Docker Compose
- Node.js & npm (for frontend)

### Backend Setup

1. **Start Infrastructure Services**
```bash
cd backend
docker-compose up -d
```

This starts:
- PostgreSQL (port 5432)
- Keycloak (port 9090)
- Adminer (port 8888)

2. **Configure Keycloak**
   - Access Keycloak at http://localhost:9090
   - Login with admin/admin
   - Create realm: `event-ticket-platform`
   - Create client: `event-ticket-platform-app`
   - Create users and assign roles (ORGANIZER, ATTENDEE, STAFF)

3. **Build Backend**
```bash
./mvnw clean package -DskipTests
```

4. **Run Backend**
```bash
./mvnw spring-boot:run
```

Backend runs at: http://localhost:8080

5. **View API Documentation**
   - Swagger UI: http://localhost:8080/api/v1/docs/ui
   - OpenAPI JSON: http://localhost:8080/api/v1/docs

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

Frontend runs at: http://localhost:4200

### Database Management

Access Adminer at http://localhost:8888
- System: PostgreSQL
- Server: db
- Username: user
- Password: password
- Database: db

---

## Data Flow

### Event Creation Flow

```
1. Organizer logs in → Keycloak issues JWT
2. Frontend: POST /api/v1/events with Bearer token
3. SecurityConfig: Validates JWT, checks ROLE_ORGANIZER
4. UserProvisioningFilter: Creates/updates User entity
5. EventController: Receives CreateEventRequestDto
6. EventMapper: Converts DTO → CreateEventRequest
7. EventService: Creates Event entity, sets organizer
8. EventRepository: Saves to database
9. EventMapper: Converts Event → CreateEventResponseDto
10. Response: Returns event details to frontend
```

### Ticket Purchase Flow

```
1. Attendee selects event and ticket type
2. Frontend: POST /api/v1/tickets with Bearer token
3. SecurityConfig: Validates JWT
4. UserProvisioningFilter: Ensures User entity exists
5. TicketController: Receives purchase request
6. TicketService:
   - Validates ticket type exists
   - Checks inventory (totalAvailable)
   - Creates Ticket entity
   - Generates QR code (Base64 PNG)
   - Saves to database
7. Response: Returns ticket with QR code
8. Attendee can scan QR code at event
```

### Ticket Validation Flow

```
1. Staff scans QR code or enters ticket ID
2. Frontend: POST /api/v1/ticket-validations
3. SecurityConfig: Validates JWT, checks ROLE_STAFF
4. TicketValidationController: Determines method (QR/MANUAL)
5. TicketValidationService:
   - Retrieves ticket
   - Validates ticket status (not already used)
   - Creates TicketValidation record
   - Updates ticket status to USED
   - Links validation to staff user
6. Response: Returns validation result
7. Entry granted/denied based on validation status
```

---

## Key Features

### 1. QR Code Generation
- Automatic QR code generation for each ticket
- Base64-encoded PNG format stored in database
- Generated using ZXing library
- QR code contains ticket ID for validation
- Retrieved via dedicated endpoint: `GET /api/v1/tickets/{id}/qr`

### 2. Inventory Management
- Each TicketType has `totalAvailable` count
- TicketService checks availability before purchase
- Throws `TicketSoldOutException` when sold out
- Prevents overselling through database constraints

### 3. Event Status Workflow
- **DRAFT**: Event being created, not visible publicly
- **PUBLISHED**: Event visible on public listings
- **CANCELLED**: Event cancelled, tickets refunded
- **COMPLETED**: Event finished

### 4. Pagination Support
- All list endpoints support pagination
- Uses Spring Data `Pageable` interface
- Query parameters: `page`, `size`, `sort`
- Example: `GET /api/v1/events?page=0&size=10&sort=createdAt,desc`

### 5. Audit Trail
- All entities extend `Log` base class
- Automatic `createdAt` and `updatedAt` timestamps
- JPA auditing enabled in `JpaConfiguration`
- Validation history tracked in `TicketValidation` entities

### 6. MapStruct Integration
- Compile-time DTO-Entity mapping
- Type-safe conversions
- No reflection overhead
- Generated mappers in `target/generated-sources/annotations`

### 7. Exception Handling
- Custom exceptions for business logic errors
- `GlobalExceptionHandler` provides consistent error responses
- Exceptions include:
  - `EventNotFoundException`
  - `TicketNotFoundException`
  - `TicketSoldOutException`
  - `QrCodeGenerationException`
  - `InvalidJwtSubjectException`

### 8. CORS Configuration
- Configurable allowed origins (default: http://localhost:4200)
- Supports credentials (cookies, authorization headers)
- Configured via `app.cors.allowed-origins` property
- Allows all common HTTP methods

---

## Development Notes

### Database Schema
- PostgreSQL with JPA/Hibernate
- `spring.jpa.hibernate.ddl-auto=update` (auto-schema updates in dev)
- For production, consider Flyway/Liquibase migrations
- H2 in-memory database available for testing

### Code Quality
- Lombok reduces boilerplate (getters, setters, constructors)
- MapStruct ensures type-safe mapping
- Spring Boot DevTools for hot reload
- Validation annotations on DTOs (@Valid, @NotNull, etc.)

### Testing
```bash
./mvnw test
```

### API Documentation
- SpringDoc OpenAPI automatically generates documentation
- Swagger UI provides interactive API testing
- Access at http://localhost:8080/api/v1/docs/ui

### Future Enhancements
- Payment integration (Stripe, PayPal)
- Email notifications (ticket confirmation, reminders)
- Refund management
- Analytics dashboard
- Mobile app support
- Event recommendations
- Venue management module
- Seating chart integration

---

## Troubleshooting

### Common Issues

**PostgreSQL Connection Error**
- Ensure Docker containers are running: `docker-compose ps`
- Check database credentials in `application.properties`

**JWT Token Invalid**
- Verify Keycloak is running on port 9090
- Check `spring.security.oauth2.resourceserver.jwt.issuer-uri`
- Ensure token hasn't expired

**CORS Errors**
- Verify frontend origin in `app.cors.allowed-origins`
- Check browser console for specific CORS issues

**Build Errors**
- Clean and rebuild: `./mvnw clean package -DskipTests`
- Ensure Java 21 is installed: `java -version`

---

## Conclusion

TicketApp is a modern, secure event ticketing platform built with industry-standard technologies. It demonstrates:

- **Clean Architecture**: Separation of concerns with layers (Controller, Service, Repository)
- **Security Best Practices**: JWT authentication, role-based access control
- **Modern Java**: Java 21, Spring Boot 3.x, latest dependencies
- **API-First Design**: RESTful APIs with OpenAPI documentation
- **Scalability**: Stateless architecture, pagination, efficient database queries
- **Maintainability**: MapStruct, Lombok, exception handling, audit trails

The platform is production-ready with proper error handling, security, and extensibility for future features.
