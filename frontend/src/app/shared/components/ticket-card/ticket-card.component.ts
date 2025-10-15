import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { ListTicketResponse } from '../../../core/models/interfaces/ticket.interface';
import { DateFormatPipe } from '../../pipes/date-format.pipe';
import { TicketStatus } from '../../../core/models/enums/ticket-status.enum';

@Component({
  selector: 'app-ticket-card',
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
  templateUrl: './ticket-card.component.html',
  styleUrl: './ticket-card.component.css'
})
export class TicketCardComponent {
  @Input() ticket!: ListTicketResponse;
  @Input() showActions = true;
  @Output() ticketClick = new EventEmitter<string>();
  @Output() viewQrCode = new EventEmitter<string>();

  TicketStatus = TicketStatus;

  onTicketClick(): void {
    this.ticketClick.emit(this.ticket.id);
  }

  onViewQrCode(event: Event): void {
    event.stopPropagation();
    this.viewQrCode.emit(this.ticket.id);
  }

  getStatusColor(status: TicketStatus): string {
    switch (status) {
      case TicketStatus.PURCHASED:
        return 'primary';
      case TicketStatus.CANCELLED:
        return 'warn';
      default:
        return '';
    }
  }
}
