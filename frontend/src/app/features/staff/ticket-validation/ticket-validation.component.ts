import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TicketValidationService } from '../../../core/services/ticket-validation.service';

@Component({
  selector: 'app-ticket-validation',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ticket-validation.component.html',
  styleUrl: './ticket-validation.component.css'
})
export class TicketValidationComponent {
  qrCode: string = '';
  validationResult: any = null;
  isValidating = false;
  error: string | null = null;

  constructor(private ticketValidationService: TicketValidationService) {}

  validateTicket(): void {
    if (!this.qrCode.trim()) {
      this.error = 'Please enter a QR code';
      return;
    }

    this.isValidating = true;
    this.error = null;
    this.validationResult = null;

    this.ticketValidationService.validateTicket(this.qrCode).subscribe({
      next: (result: any) => {
        this.validationResult = result;
        this.isValidating = false;
      },
      error: (err: any) => {
        this.error = 'Failed to validate ticket. Please try again.';
        this.isValidating = false;
        console.error('Error validating ticket:', err);
      }
    });
  }

  reset(): void {
    this.qrCode = '';
    this.validationResult = null;
    this.error = null;
  }

  isValid(): boolean {
    return this.validationResult?.valid === true;
  }
}
