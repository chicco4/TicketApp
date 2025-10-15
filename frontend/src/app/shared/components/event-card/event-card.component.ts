import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { ListEventResponse, ListPublishedEventResponse } from '../../../core/models/interfaces/event.interface';
import { DateFormatPipe } from '../../pipes/date-format.pipe';
import { EventStatus } from '../../../core/models/enums/event-status.enum';

@Component({
  selector: 'app-event-card',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatChipsModule,
    MatIconModule,
    DateFormatPipe
  ],
  templateUrl: './event-card.component.html',
  styleUrl: './event-card.component.css'
})
export class EventCardComponent {
  @Input() event!: ListEventResponse | ListPublishedEventResponse;
  @Input() showActions = true;
  @Input() viewMode: 'attendee' | 'organizer' = 'attendee';
  @Output() eventClick = new EventEmitter<string>();

  EventStatus = EventStatus;

  onEventClick(): void {
    this.eventClick.emit(this.event.id);
  }

  getStatusColor(status: EventStatus): string {
    switch (status) {
      case EventStatus.PUBLISHED:
        return 'primary';
      case EventStatus.DRAFT:
        return 'accent';
      case EventStatus.CANCELLED:
        return 'warn';
      case EventStatus.COMPLETED:
        return '';
      default:
        return '';
    }
  }
}
