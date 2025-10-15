import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { EventService } from '../../../core/services/event.service';
import { Event } from '../../../core/models/interfaces/event.interface';
import { DateFormatPipe } from '../../../shared/pipes/date-format.pipe';
import { CurrencyPipe } from '../../../shared/pipes/currency.pipe';

@Component({
  selector: 'app-event-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, DateFormatPipe, CurrencyPipe],
  templateUrl: './event-dashboard.component.html',
  styleUrl: './event-dashboard.component.css'
})
export class EventDashboardComponent implements OnInit {
  event: Event | null = null;
  eventId: string = '';
  isLoading = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private eventService: EventService
  ) {}

  ngOnInit(): void {
    this.eventId = this.route.snapshot.paramMap.get('id') || '';
    if (this.eventId) {
      this.loadEventDashboard();
    }
  }

  loadEventDashboard(): void {
    this.isLoading = true;
    this.error = null;

    this.eventService.getEvent(this.eventId).subscribe({
      next: (event: Event) => {
        this.event = event;
        this.isLoading = false;
      },
      error: (err: any) => {
        this.error = 'Failed to load event dashboard. Please try again.';
        this.isLoading = false;
        console.error('Error loading event dashboard:', err);
      }
    });
  }

  getTotalRevenue(): number {
    if (!this.event || !this.event.ticketTypes) return 0;
    return this.event.ticketTypes.reduce((total, type) => {
      const sold = type.quantity - (type.availableQuantity || type.quantity);
      return total + (type.price * sold);
    }, 0);
  }

  getTotalTicketsSold(): number {
    if (!this.event || !this.event.ticketTypes) return 0;
    return this.event.ticketTypes.reduce((total, type) => {
      return total + (type.quantity - (type.availableQuantity || type.quantity));
    }, 0);
  }

  getAvailableSeats(): number {
    return this.event?.availableSeats || 0;
  }
}
