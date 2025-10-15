import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { PublishedEventService } from '../../../core/services/published-event.service';
import { TicketTypeService } from '../../../core/services/ticket-type.service';
import { GetPublishedEventDetailsResponse } from '../../../core/models/interfaces/event.interface';
import { DateFormatPipe } from '../../../shared/pipes/date-format.pipe';
import { CurrencyPipe as CustomCurrencyPipe } from '../../../shared/pipes/currency.pipe';
import { EventStatus } from '../../../core/models/enums/event-status.enum';

@Component({
  selector: 'app-event-details',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatChipsModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    DateFormatPipe,
    CustomCurrencyPipe
  ],
  templateUrl: './event-details.component.html',
  styleUrl: './event-details.component.css'
})
export class EventDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private publishedEventService = inject(PublishedEventService);
  private ticketTypeService = inject(TicketTypeService);
  private snackBar = inject(MatSnackBar);

  event: GetPublishedEventDetailsResponse | null = null;
  loading = false;
  error: string | null = null;
  purchasing = false;

  EventStatus = EventStatus;

  ngOnInit(): void {
    const eventId = this.route.snapshot.paramMap.get('id');
    if (eventId) {
      this.loadEventDetails(eventId);
    }
  }

  loadEventDetails(eventId: string): void {
    this.loading = true;
    this.error = null;

    this.publishedEventService.getPublishedEventDetails(eventId)
      .subscribe({
        next: (data) => {
          this.event = data;
          this.loading = false;
        },
        error: () => {
          this.error = 'Failed to load event details.';
          this.loading = false;
        }
      });
  }

  purchaseTicket(ticketTypeId: string): void {
    this.purchasing = true;

    this.ticketTypeService.purchaseTicket(ticketTypeId)
      .subscribe({
        next: (ticket) => {
          this.purchasing = false;
          this.snackBar.open('Ticket purchased successfully!', 'View', {
            duration: 5000,
            horizontalPosition: 'end',
            verticalPosition: 'top'
          }).onAction().subscribe(() => {
            this.router.navigate(['/my-tickets', ticket.id]);
          });
          
          if (this.event) {
            this.loadEventDetails(this.event.id);
          }
        },
        error: () => {
          this.purchasing = false;
          this.snackBar.open('Failed to purchase ticket. Please try again.', 'Close', {
            duration: 3000
          });
        }
      });
  }

  goBack(): void {
    this.router.navigate(['/events']);
  }
}
