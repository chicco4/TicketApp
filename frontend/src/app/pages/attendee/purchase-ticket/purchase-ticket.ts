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
import { Subscription, switchMap, of } from 'rxjs';
import { getEventTypeImage } from '../../../core/utils/event-type-images';

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
    ReactiveFormsModule
  ],
  templateUrl: './purchase-ticket.html',
  styleUrl: './purchase-ticket.css'
})
export class PurchaseTicket implements OnDestroy {
  loading = true;
  error?: string;
  event?: PublishedEvent;
  ticketType?: TicketType;
  purchaseForm: FormGroup;

  private sub: Subscription;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly service: PublishedEventsService,
    private readonly fb: FormBuilder
  ) {
    this.purchaseForm = this.fb.group({
      quantity: [1, [Validators.required, Validators.min(1), Validators.max(10)]],
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });

    // Get event data from navigation state
    const navigation = this.router.getCurrentNavigation();
    const stateEvent = navigation?.extras?.state?.['event'] as PublishedEvent | undefined;

    this.sub = this.route.paramMap
      .pipe(switchMap((params) => {
        const ticketTypeId = params.get('ticketTypeId');
        if (!ticketTypeId) throw new Error('Missing ticket type ID');
        
        this.loading = true;
        this.error = undefined;

        // If we have event data from state, use it directly
        if (stateEvent) {
          return of(stateEvent);
        }

        // Otherwise, we need to handle the case where state is not available
        // (e.g., page refresh). For now, redirect back to events list.
        this.error = 'Session expired. Please select an event again.';
        this.loading = false;
        throw new Error('No event data available');
      }))
      .subscribe({
        next: (ev) => {
          this.event = ev;
          const ticketTypeId = this.route.snapshot.paramMap.get('ticketTypeId');
          this.ticketType = ev.ticketTypes.find(tt => tt.id === ticketTypeId);
          if (!this.ticketType) {
            this.error = 'Ticket type not found';
          }
          this.loading = false;
        },
        error: (err) => {
          this.loading = false;
          if (!this.error) {
            this.error = err?.error?.message || 'Failed to load event details.';
          }
        },
      });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  getEventImage(eventType: string): string {
    return getEventTypeImage(eventType);
  }

  getTotalPrice(): number {
    if (!this.ticketType) return 0;
    const quantity = this.purchaseForm.get('quantity')?.value || 1;
    return this.ticketType.price * quantity;
  }

  onSubmit(): void {
    if (this.purchaseForm.valid && this.event && this.ticketType) {
      // TODO: Implement actual ticket purchase logic
      console.log('Purchase ticket:', {
        event: this.event,
        ticketType: this.ticketType,
        ...this.purchaseForm.value
      });
      // For now, just show an alert and navigate back
      alert('Ticket purchase functionality will be implemented soon!');
    }
  }

  goBack(): void {
    if (this.event) {
      this.router.navigate(['/attendee/published-events', this.event.id]);
    } else {
      this.router.navigate(['/attendee/published-events']);
    }
  }
}
