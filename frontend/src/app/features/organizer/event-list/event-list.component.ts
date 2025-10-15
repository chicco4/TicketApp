import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { EventService } from '../../../core/services/event.service';
import { Event } from '../../../core/models/interfaces/event.interface';
import { EventCardComponent } from '../../../shared/components/event-card/event-card.component';

@Component({
  selector: 'app-event-list',
  standalone: true,
  imports: [CommonModule, RouterLink, EventCardComponent],
  templateUrl: './event-list.component.html',
  styleUrl: './event-list.component.css'
})
export class EventListComponent implements OnInit {
  events: Event[] = [];
  isLoading = true;
  error: string | null = null;

  constructor(private eventService: EventService) {}

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    this.isLoading = true;
    this.error = null;

    this.eventService.getMyEvents().subscribe({
      next: (events: Event[]) => {
        this.events = events;
        this.isLoading = false;
      },
      error: (err: any) => {
        this.error = 'Failed to load events. Please try again.';
        this.isLoading = false;
        console.error('Error loading events:', err);
      }
    });
  }

  deleteEvent(eventId: number): void {
    if (confirm('Are you sure you want to delete this event?')) {
      this.eventService.deleteEvent(eventId).subscribe({
        next: () => {
          this.events = this.events.filter(e => e.id !== eventId);
        },
        error: (err: any) => {
          console.error('Error deleting event:', err);
          alert('Failed to delete event. Please try again.');
        }
      });
    }
  }
}
