# TicketApp Frontend - Angular Material Implementation

## 🎉 Implementation Status

### ✅ COMPLETED (Ready to Use)

#### Core Infrastructure
- **Environment Configuration**: Dev/Prod environments configured
- **Angular Material**: Fully integrated with animations
- **HTTP Client**: Configured with interceptors
- **Authentication**: JWT-based auth service with token management
- **Guards**: Auth guard and role-based guard for route protection

#### Services (All 5 Backend APIs Integrated)
- `AuthService` - Login, logout, token management
- `EventService` - Organizer CRUD operations
- `PublishedEventService` - Public event browsing
- `TicketService` - User tickets & QR codes
- `TicketTypeService` - Ticket purchases
- `TicketValidationService` - Staff validation

#### Models & Enums
- All enums matching backend (EventStatus, EventType, TicketStatus, etc.)
- All interfaces (Event, Ticket, TicketType, TicketValidation, Page)

#### Shared Components
- **Header** - Responsive navigation with role-based menus
- **Footer** - Application footer
- **EventCard** - Reusable event display card
- **TicketCard** - Reusable ticket display card
- **Pagination** - Material paginator wrapper

#### Shared Pipes
- **DateFormatPipe** - Flexible date formatting
- **CurrencyPipe** - Currency formatting

#### Attendee Features
- **Events List** - Browse & search published events with pagination
- **Event Details** - View event details & purchase tickets

#### Authentication
- **Login** - Complete login page with form validation
- **Unauthorized** - Access denied page

#### Routing
- Main routes configured with lazy loading
- All route guards in place
- Feature module routes ready

---

## 📋 TODO (Templates Created, Need Implementation)

### Priority 1: Attendee Features
- [ ] **My Tickets List** - Display user's purchased tickets
- [ ] **Ticket Detail** - Show individual ticket with QR code

### Priority 2: Organizer Features  
- [ ] **Event List** - Organizer's events dashboard
- [ ] **Create Event** - Form to create events with ticket types
- [ ] **Edit Event** - Update existing events
- [ ] **Event Dashboard** - Analytics and attendee management

### Priority 3: Staff Features
- [ ] **Ticket Validation** - QR scanner and manual validation

---

## 🚀 Quick Start

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm start
# or
ng serve

# Open browser
http://localhost:4200
```

---

## 📁 Project Structure

```
src/app/
├── core/
│   ├── guards/          ✅ auth.guard.ts, role.guard.ts
│   ├── interceptors/    ✅ auth.interceptor.ts, error.interceptor.ts
│   ├── models/
│   │   ├── enums/       ✅ All backend enums
│   │   └── interfaces/  ✅ All DTOs as interfaces
│   └── services/        ✅ All 5 API services
│
├── features/
│   ├── attendee/
│   │   ├── events/                    ✅ Complete
│   │   ├── event-details/             ✅ Complete
│   │   └── my-tickets/                ⏳ Routes created, components TODO
│   │
│   ├── organizer/                     ⏳ Routes created, components TODO
│   │   ├── event-list/
│   │   ├── create-event/
│   │   ├── edit-event/
│   │   └── event-dashboard/
│   │
│   ├── staff/                         ⏳ Routes created, components TODO
│   │   └── ticket-validation/
│   │
│   └── auth/
│       ├── login/                     ✅ Complete
│       └── unauthorized/              ✅ Complete
│
└── shared/
    ├── components/
    │   ├── header/         ✅ Complete
    │   ├── footer/         ✅ Complete
    │   ├── event-card/     ✅ Complete
    │   ├── ticket-card/    ✅ Complete
    │   └── pagination/     ✅ Complete
    │
    └── pipes/
        ├── date-format.pipe.ts   ✅ Complete
        └── currency.pipe.ts      ✅ Complete
```

---

## 🎨 Features Overview

### Current Features

#### 1. Public Event Browsing
- Search events by title, location, or type
- Paginated list with Material cards
- Responsive grid layout
- Event details with ticket types

#### 2. Ticket Purchase Flow
- Select event → View details → Purchase ticket
- Real-time availability updates
- Success notification with navigation

#### 3. Authentication
- JWT-based authentication
- Token stored in localStorage
- Auto-redirect after login
- Protected routes with guards

#### 4. Role-Based Access
- Attendee: Browse events, view tickets
- Organizer: Manage events (routes ready)
- Staff: Validate tickets (routes ready)

### Upcoming Features

#### 1. My Tickets (TODO)
- List all purchased tickets
- Filter by status
- View ticket details
- Display QR code for validation

#### 2. Event Management (TODO)
- Create events with multiple ticket types
- Edit event details and pricing
- View sales analytics
- Manage attendees

#### 3. Ticket Validation (TODO)
- QR code scanner
- Manual validation by ticket ID
- Validation history
- Real-time status updates

---

## 🔧 Configuration

### Environment Variables

**`src/environments/environment.ts`** (Development)
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api/v1'
};
```

**`src/environments/environment.prod.ts`** (Production)
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://your-api-domain.com/api/v1'
};
```

### Backend API Endpoints

The frontend is configured to work with these backend endpoints:

- `POST /auth/login` - Authentication
- `GET /published-events` - Browse events (public)
- `GET /published-events/{id}` - Event details (public)
- `GET /events` - Organizer's events (protected)
- `POST /events` - Create event (protected)
- `PUT /events/{id}` - Update event (protected)
- `DELETE /events/{id}` - Delete event (protected)
- `GET /tickets` - User's tickets (protected)
- `GET /tickets/{id}` - Ticket details (protected)
- `GET /tickets/{id}/qr-code` - QR code image (protected)
- `POST /ticket-types/{id}` - Purchase ticket (protected)
- `POST /ticket-validations` - Validate ticket (protected)

---

## 📚 Material Components Used

### Current Implementation
- MatToolbar, MatButton, MatIcon
- MatCard, MatChipSet
- MatFormField, MatInput
- MatPaginator
- MatProgressSpinner
- MatSnackBar
- MatMenu

### For TODO Components
- MatTable, MatSort
- MatDialog
- MatDatepicker
- MatSelect, MatCheckbox
- MatTabs
- MatExpansionPanel

---

## 🎯 Next Steps

### Week 1: Complete Attendee Experience
1. Implement My Tickets list component
2. Implement Ticket Detail with QR code display
3. Test full attendee flow: Browse → Purchase → View Ticket

### Week 2: Organizer Features
1. Event List with pagination
2. Create Event form with ticket types
3. Edit Event functionality
4. Basic event dashboard

### Week 3: Staff & Polish
1. Ticket Validation component
2. QR code scanner integration
3. Refinements and bug fixes
4. Responsive design improvements

### Week 4: Advanced Features
1. Analytics dashboards
2. Export functionality
3. Advanced filters
4. Notifications

---

## 🧪 Testing the Current Implementation

```bash
# 1. Start the backend
cd backend
./mvnw spring-boot:run

# 2. Start the frontend
cd frontend
npm start

# 3. Test these flows:
```

### Test Scenarios

1. **Browse Events**
   - Navigate to http://localhost:4200
   - Should see events list
   - Try searching

2. **View Event Details**
   - Click on an event card
   - Should show event details and ticket types

3. **Login** (when backend auth is ready)
   - Navigate to /login
   - Enter credentials
   - Should redirect to events

4. **Protected Routes**
   - Try accessing /my-tickets without login
   - Should redirect to login

---

## 📖 Documentation

- **IMPLEMENTATION_GUIDE.md** - Detailed implementation guide
- **create-components.sh** - Script to create remaining directories
- This README - Overview and quick start

---

## 🤝 Development Guidelines

### Component Pattern

All components follow this structure:
```typescript
@Component({
  selector: 'app-component-name',
  standalone: true,
  imports: [/* Material modules, pipes, etc */],
  templateUrl: './component.html',
  styleUrl: './component.css'
})
export class ComponentName implements OnInit {
  // Inject services
  private service = inject(SomeService);
  
  // Component state
  data: Type | null = null;
  loading = false;
  error: string | null = null;
  
  // Lifecycle
  ngOnInit(): void {
    this.loadData();
  }
  
  // Methods
  loadData(): void { }
}
```

### Service Pattern

```typescript
@Injectable({ providedIn: 'root' })
export class SomeService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/resource`;
  
  getItems(page: number, size: number): Observable<Page<Item>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<Page<Item>>(this.apiUrl, { params });
  }
}
```

---

## 🎨 Styling Guidelines

- Use Material Design principles
- Responsive breakpoints: 768px (mobile/tablet)
- Max content width: 1200px
- Consistent spacing: 8px, 16px, 24px, 32px
- Color palette from Material theme

---

## ✨ Summary

**You now have a production-ready Angular Material frontend structure with:**

- ✅ Complete core infrastructure
- ✅ All backend API integrations
- ✅ Authentication & authorization
- ✅ Reusable components library
- ✅ Working attendee event browsing
- ✅ Professional UI/UX with Material Design
- ⏳ Clear path forward for remaining features

**The foundation is solid. The remaining work is just building out the feature components following the established patterns!**

Happy coding! 🚀
