import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PublishedEventsService } from '../../../core/services/published-events.service';
import { PublishedEvent } from '../../../core/models/interfaces/published-event';
import { TicketType } from '../../../core/models/interfaces/ticket-type';
import { TicketTypesService } from '../../../core/services/ticket-types.service';
import { EMPTY, of, Subscription, switchMap } from 'rxjs';
import { MoneyPipe } from '../../../shared/pipes/money.pipe';

@Component({
  selector: 'app-purchase-ticket',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MoneyPipe,
  ],
  templateUrl: './purchase-ticket.html',
  styleUrl: './purchase-ticket.css'
})
export class PurchaseTicket implements OnDestroy {
  loading = true;
  loadError?: string;
  purchaseError?: string;
  event?: PublishedEvent;
  ticketType?: TicketType;
  purchaseForm: FormGroup;
  purchaseInProgress = false;

  private ticketTypeId?: string;
  private sub: Subscription;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly service: PublishedEventsService,
    private readonly ticketTypesService: TicketTypesService,
    private readonly fb: FormBuilder
  ) {
    this.purchaseForm = this.fb.group({
      quantity: [1, [Validators.required, Validators.min(1), Validators.max(10)]]
    });

    // Get event data from navigation state
    const navigation = this.router.getCurrentNavigation();
    const stateEvent = navigation?.extras?.state?.['event'] as PublishedEvent | undefined;

    this.sub = this.route.paramMap
      .pipe(switchMap((params) => {
        const eventId = params.get('eventId');
        const ticketTypeId = params.get('ticketTypeId');
        if (!eventId || !ticketTypeId) {
          this.loading = false;
          this.loadError = 'Missing event information. Please select a ticket again.';
          return EMPTY;
        }
        
        this.loading = true;
        this.loadError = undefined;
        this.ticketTypeId = ticketTypeId;

        // If we have event data from state, use it directly
        if (stateEvent && stateEvent.id === eventId) {
          return of(stateEvent);
        }

        // Otherwise fetch the event details from the backend
        return this.service.getPublishedEventById(eventId);
      }))
      .subscribe({
        next: (ev) => {
          this.event = ev;
          this.ticketType = ev.ticketTypes.find(tt => tt.id === this.ticketTypeId);
          if (!this.ticketType) {
            this.loadError = 'The selected ticket type is no longer available.';
            this.event = undefined;
          }
          this.loading = false;
        },
        error: (err) => {
          this.loading = false;
          this.loadError = err?.error?.error || err?.error?.message || 'Failed to load event details.';
        },
      });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  getTotalPrice(): number {
    if (!this.ticketType) return 0;
    const quantity = this.purchaseForm.get('quantity')?.value || 1;
    return this.ticketType.price * quantity;
  }

  onSubmit(): void {
    if (!this.purchaseForm.valid || !this.ticketType) {
      return;
    }

    const quantity = Number(this.purchaseForm.get('quantity')?.value ?? 1);
    if (quantity < 1) {
      return;
    }

    this.purchaseInProgress = true;
    this.purchaseError = undefined;

    this.ticketTypesService.purchaseTickets(this.ticketType.id, quantity).subscribe({
      next: (tickets) => {
        this.purchaseInProgress = false;
        this.router.navigate(['/attendee/purchase-success'], {
          state: {
            tickets,
            event: this.event,
            ticketType: this.ticketType,
            quantity,
          },
        });
      },
      error: (err) => {
        this.purchaseInProgress = false;
        this.purchaseError = err?.error?.error || err?.error?.message || 'Failed to complete purchase.';
      }
    });
  }

  goBack(): void {
    if (this.event) {
      this.router.navigate(['/attendee/published-events', this.event.id]);
    } else {
      this.router.navigate(['/attendee/published-events']);
    }
  }
}
