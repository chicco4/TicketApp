# Angular Material Frontend Implementation Guide

## ✅ Completed Structure

### Core Infrastructure
- ✅ Environment configuration (dev/prod)
- ✅ Angular Material setup with animations
- ✅ HTTP client with interceptors (auth & error handling)
- ✅ Authentication service with JWT handling
- ✅ All backend service integrations

### Guards
- ✅ `auth.guard.ts` - Basic authentication
- ✅ `role.guard.ts` - Role-based access control

### Models
- ✅ Enums (EventStatus, EventType, TicketStatus, TicketValidationMethod, TicketValidationStatus)
- ✅ Interfaces (Event, Ticket, TicketType, TicketValidation, Page)

### Services
- ✅ `auth.service.ts` - Login/logout, token management
- ✅ `event.service.ts` - CRUD operations for organizer events
- ✅ `published-event.service.ts` - Public event browsing
- ✅ `ticket.service.ts` - User tickets & QR codes
- ✅ `ticket-type.service.ts` - Ticket purchases
- ✅ `ticket-validation.service.ts` - Staff validation

### Shared Components
- ✅ `header` - Navigation with role-based menus
- ✅ `footer` - App footer
- ✅ `event-card` - Reusable event display
- ✅ `ticket-card` - Reusable ticket display
- ✅ `pagination` - Material paginator wrapper

### Shared Pipes
- ✅ `date-format.pipe.ts` - Date formatting
- ✅ `currency.pipe.ts` - Currency formatting

### Attendee Features
- ✅ `events` - Browse & search published events
- ✅ `event-details` - View event & purchase tickets

## 📋 Remaining Implementation Tasks

### 1. Attendee Features (Priority: HIGH)

#### My Tickets Page
```bash
# Create route configuration
touch frontend/src/app/features/attendee/my-tickets/my-tickets.routes.ts

# Create my-tickets list component
ng generate component features/attendee/my-tickets/my-tickets --standalone

# Create ticket-detail component  
ng generate component features/attendee/my-tickets/ticket-detail --standalone
```

**Key Features:**
- List user's purchased tickets with pagination
- Filter by status (PURCHASED, CANCELLED)
- View ticket details with QR code
- Download/share QR code functionality

### 2. Organizer Features (Priority: HIGH)

```bash
# Create route configuration
touch frontend/src/app/features/organizer/organizer.routes.ts

# Create components
ng generate component features/organizer/event-list --standalone
ng generate component features/organizer/create-event --standalone
ng generate component features/organizer/edit-event --standalone
ng generate component features/organizer/event-dashboard --standalone
```

**Key Features:**
- **event-list**: Display organizer's events with pagination
- **create-event**: Form to create new events with ticket types
- **edit-event**: Form to update event details & ticket types
- **event-dashboard**: Event analytics, ticket sales, attendee list

### 3. Staff Features (Priority: MEDIUM)

```bash
# Create route configuration
touch frontend/src/app/features/staff/staff.routes.ts

# Create components
ng generate component features/staff/ticket-validation --standalone
```

**Key Features:**
- QR code scanner integration
- Manual ticket ID validation
- Display validation status
- Validation history

### 4. Authentication Pages (Priority: HIGH)

```bash
# Create components
ng generate component features/auth/login --standalone
ng generate component features/auth/unauthorized --standalone
```

**login component:**
- Login form with username/password
- OAuth2/Keycloak integration
- Remember me functionality
- Redirect to return URL after login

**unauthorized component:**
- Display access denied message
- Suggest appropriate actions

### 5. Additional Shared Components (Priority: MEDIUM)

#### QR Code Scanner
```bash
ng generate component shared/components/qr-code-scanner --standalone
```

Install QR code libraries:
```bash
npm install @zxing/library @zxing/ngx-scanner
```

#### Loading Spinner
```bash
ng generate component shared/components/loading-spinner --standalone
```

#### Confirmation Dialog
```bash
ng generate component shared/components/confirmation-dialog --standalone
```

## 🎨 Material Theme Customization

Update `src/custom-theme.scss`:

```scss
@use '@angular/material' as mat;

@include mat.core();

$my-primary: mat.m2-define-palette(mat.$m2-indigo-palette);
$my-accent: mat.m2-define-palette(mat.$m2-pink-palette, A200, A100, A400);
$my-warn: mat.m2-define-palette(mat.$m2-red-palette);

$my-theme: mat.m2-define-light-theme((
  color: (
    primary: $my-primary,
    accent: $my-accent,
    warn: $my-warn,
  ),
  typography: mat.m2-define-typography-config(),
  density: 0,
));

@include mat.all-component-themes($my-theme);
```

## 📁 Complete Project Structure

```
src/app/
├── app.config.ts                    ✅
├── app.routes.ts                    ✅
├── app.ts                           ✅
├── app.html                         ✅
├── app.css                          ✅
├── core/
│   ├── guards/
│   │   ├── auth.guard.ts           ✅
│   │   └── role.guard.ts           ✅
│   ├── interceptors/
│   │   ├── auth.interceptor.ts     ✅
│   │   └── error.interceptor.ts    ✅
│   ├── models/
│   │   ├── enums/                  ✅ (all enums)
│   │   └── interfaces/             ✅ (all interfaces)
│   └── services/                    ✅ (all services)
├── features/
│   ├── attendee/
│   │   ├── events/                 ✅
│   │   ├── event-details/          ✅
│   │   └── my-tickets/             ⏳ TODO
│   │       ├── my-tickets.routes.ts
│   │       ├── my-tickets.component.*
│   │       └── ticket-detail/
│   ├── organizer/                   ⏳ TODO
│   │   ├── organizer.routes.ts
│   │   ├── event-list/
│   │   ├── create-event/
│   │   ├── edit-event/
│   │   └── event-dashboard/
│   ├── staff/                       ⏳ TODO
│   │   ├── staff.routes.ts
│   │   └── ticket-validation/
│   └── auth/                        ⏳ TODO
│       ├── login/
│       └── unauthorized/
└── shared/
    ├── components/
    │   ├── header/                  ✅
    │   ├── footer/                  ✅
    │   ├── event-card/              ✅
    │   ├── ticket-card/             ✅
    │   ├── pagination/              ✅
    │   ├── qr-code-scanner/         ⏳ TODO
    │   ├── loading-spinner/         ⏳ TODO
    │   └── confirmation-dialog/     ⏳ TODO
    ├── directives/
    └── pipes/
        ├── date-format.pipe.ts      ✅
        └── currency.pipe.ts         ✅
```

## 🚀 Quick Start Commands

```bash
# Install dependencies (if needed)
cd frontend
npm install

# Start development server
npm start
# or
ng serve

# Build for production
npm run build
# or
ng build --configuration production

# Run tests
npm test
# or
ng test

# Generate a new component (example)
ng generate component features/attendee/my-tickets/my-tickets --standalone
```

## 🔑 Environment Variables

Make sure to update `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api/v1'  // Your backend URL
};
```

## 📝 Implementation Priority

1. **CRITICAL (Week 1)**
   - Auth pages (login, unauthorized)
   - My Tickets feature
   - Route configurations

2. **HIGH (Week 2)**
   - Organizer event-list
   - Organizer create-event
   - Organizer edit-event

3. **MEDIUM (Week 3)**
   - Organizer event-dashboard
   - Staff ticket-validation
   - QR code scanner

4. **NICE TO HAVE (Week 4)**
   - Advanced filtering/sorting
   - Analytics dashboards
   - Notifications
   - Export functionality

## 🧪 Testing Checklist

- [ ] Test authentication flow
- [ ] Test role-based access (attendee, organizer, staff)
- [ ] Test event browsing & search
- [ ] Test ticket purchase flow
- [ ] Test QR code display
- [ ] Test event CRUD operations (organizer)
- [ ] Test ticket validation (staff)
- [ ] Test responsive design (mobile/tablet/desktop)
- [ ] Test error handling
- [ ] Test loading states

## 📚 Useful Angular Material Components

Components you'll need for remaining features:

- **Forms**: MatFormField, MatInput, MatSelect, MatDatepicker, MatCheckbox
- **Dialogs**: MatDialog, MatDialogModule
- **Tables**: MatTable, MatSort, MatPaginator
- **Tabs**: MatTabs
- **Expansion**: MatExpansionPanel
- **Snackbar**: MatSnackBar (already used)
- **Progress**: MatProgressSpinner, MatProgressBar

## 🔗 Next Steps

1. Create missing route configurations
2. Implement authentication pages (login/unauthorized)
3. Complete my-tickets feature
4. Build organizer features
5. Implement staff validation
6. Add QR code scanner
7. Write unit tests
8. Perform e2e testing

---

**Note**: All core infrastructure, services, guards, and base components are complete. Focus on creating the remaining feature components following the patterns established in the attendee features.
