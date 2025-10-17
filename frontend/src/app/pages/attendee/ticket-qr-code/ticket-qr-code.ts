import { Component, OnDestroy } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { forkJoin, Subscription, throwError } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { TicketsService } from '../../../core/services/tickets.service';
import { TicketDetail } from '../../../core/models/interfaces/ticket';

@Component({
  selector: 'app-attendee-ticket-qr-code',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatProgressSpinnerModule, DatePipe],
  templateUrl: './ticket-qr-code.html',
  styleUrl: './ticket-qr-code.css'
})
export class AttendeeTicketQrCode implements OnDestroy {
  loading = true;
  error?: string;
  ticket?: TicketDetail;
  qrCodeUrl?: string;

  private sub: Subscription;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly ticketsService: TicketsService
  ) {
    this.sub = this.route.paramMap
      .pipe(
        switchMap((params: ParamMap) => {
          const ticketId = params.get('ticketId');
          if (!ticketId) {
            return throwError(() => new Error('Missing ticket id'));
          }
          this.loading = true;
          this.error = undefined;
          return forkJoin({
            detail: this.ticketsService.getTicketById(ticketId),
            qr: this.ticketsService.getTicketQrCode(ticketId)
          });
        })
      )
      .subscribe({
        next: ({ detail, qr }) => {
          this.ticket = detail;
          this.setQrCode(qr);
          this.loading = false;
        },
        error: (err) => {
          this.loading = false;
          this.error = err?.error?.message || err?.message || 'Failed to load QR code.';
        }
      });
  }

  private setQrCode(blob: Blob): void {
    if (this.qrCodeUrl) {
      this.ticketsService.revokeQrCodeUrl(this.qrCodeUrl);
    }
    this.qrCodeUrl = this.ticketsService.createQrCodeUrl(blob);
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
    if (this.qrCodeUrl) {
      this.ticketsService.revokeQrCodeUrl(this.qrCodeUrl);
    }
  }

  downloadQrCode(): void {
    if (!this.qrCodeUrl) return;
    const link = document.createElement('a');
    link.href = this.qrCodeUrl;
    link.download = this.buildFileName();
    link.click();
    link.remove();
  }

  goToTicket(): void {
    if (this.ticket?.id) {
      this.router.navigate(['/attendee/ticket-details', this.ticket.id]);
    } else {
      this.router.navigate(['/attendee/tickets']);
    }
  }

  private buildFileName(): string {
    const base = this.ticket?.eventName
      ? `${this.ticket.eventName.replace(/[^a-z0-9]+/gi, '-').replace(/-+/g, '-')}`
      : 'ticket';
    const id = this.ticket?.id ?? 'qr';
    return `${base.toLowerCase()}-${id}.png`;
  }
}
