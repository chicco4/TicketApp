import { CommonModule, DatePipe } from '@angular/common';
import {
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
  inject,
} from '@angular/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TicketValidationService } from '../../../core/services/ticket-validation.service';
import { TicketValidationMethod } from '../../../core/models/enums/ticket-validation-method.enum';
import { TicketValidationStatus } from '../../../core/models/enums/ticket-validation-status.enum';

interface ValidationResult {
  ticketId: string;
  status: TicketValidationStatus;
  method: TicketValidationMethod;
  code: string;
  timestamp: Date;
}

@Component({
  selector: 'app-staff-validate-tickets',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './validate-tickets.html',
  styleUrl: './validate-tickets.css',
})
export class StaffValidateTickets implements OnDestroy {
  @ViewChild('scannerVideo')
  private readonly scannerVideo?: ElementRef<HTMLVideoElement>;

  private readonly formBuilder = inject(FormBuilder);
  private readonly ticketValidationService = inject(TicketValidationService);

  readonly manualForm = this.formBuilder.nonNullable.group({
    code: ['', [Validators.required, Validators.minLength(4)]],
  });

  readonly scannerSupported =
    typeof window !== 'undefined' &&
    'BarcodeDetector' in window &&
    !!navigator.mediaDevices?.getUserMedia;

  scannerActive = false;
  validating = false;
  validationError?: string;
  scannerError?: string;
  validationResult?: ValidationResult;

  protected readonly TicketValidationMethod = TicketValidationMethod;
  protected readonly TicketValidationStatus = TicketValidationStatus;

  private detector?: {
    detect(source: HTMLVideoElement): Promise<Array<{ rawValue?: string }>>;
  };
  private stream?: MediaStream;
  private scanAnimationHandle?: number;

  constructor() {
    if (this.scannerSupported) {
      try {
        const barcodeDetector = (window as any).BarcodeDetector as {
          new (options?: { formats?: string[] }): {
            detect(source: HTMLVideoElement): Promise<
              Array<{ rawValue?: string }>
            >;
          };
        };
        this.detector = new barcodeDetector({ formats: ['qr_code'] });
      } catch (err) {
        console.error('Unable to initialize barcode detector.', err);
        this.scannerError =
          'Unable to access QR scanner. Please use manual validation.';
      }
    }
  }

  async toggleScanner(): Promise<void> {
    if (this.scannerActive) {
      this.stopScanner();
      return;
    }

    await this.startScanner();
  }

  async startScanner(): Promise<void> {
    if (!this.scannerSupported) {
      this.scannerError =
        'QR scanning is not supported on this device. Please validate tickets manually.';
      return;
    }

    if (!this.detector) {
      try {
        const barcodeDetector = (window as any).BarcodeDetector as {
          new (options?: { formats?: string[] }): {
            detect(source: HTMLVideoElement): Promise<
              Array<{ rawValue?: string }>
            >;
          };
        };
        this.detector = new barcodeDetector({ formats: ['qr_code'] });
      } catch (error) {
        console.error('Failed to create BarcodeDetector', error);
        this.scannerError =
          'QR scanning is currently unavailable. Please validate tickets manually.';
        return;
      }
    }

    const video = this.scannerVideo?.nativeElement;
    if (!video) {
      this.scannerError =
        'Scanner is not ready yet. Please reload the page or try manual validation.';
      return;
    }

    this.scannerError = undefined;
    this.validationError = undefined;
    this.validationResult = undefined;

    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: 'environment' },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });

      video.srcObject = this.stream;
      video.setAttribute('playsinline', 'true');

      await video.play();
      this.scannerActive = true;
      this.scanNextFrame();
    } catch (error) {
      console.error('Unable to start camera stream', error);
      this.scannerError =
        'Unable to access the camera. Check browser permissions or use manual validation.';
      this.stopScanner();
    }
  }

  stopScanner(): void {
    this.scannerActive = false;

    if (this.scanAnimationHandle) {
      cancelAnimationFrame(this.scanAnimationHandle);
      this.scanAnimationHandle = undefined;
    }

    const video = this.scannerVideo?.nativeElement;
    if (video) {
      video.pause();
      video.removeAttribute('srcObject');
      video.srcObject = null;
    }

    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
      this.stream = undefined;
    }
  }

  private scanNextFrame(): void {
    if (!this.scannerActive || !this.detector) {
      return;
    }

    this.scanAnimationHandle = requestAnimationFrame(async () => {
      await this.scanFrame();
      this.scanNextFrame();
    });
  }

  private async scanFrame(): Promise<void> {
    if (!this.scannerActive || !this.detector) {
      return;
    }

    const video = this.scannerVideo?.nativeElement;
    if (!video || video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) {
      return;
    }

    try {
      const barcodes = await this.detector.detect(video);
      const match = barcodes?.find(
        (barcode) => typeof barcode.rawValue === 'string' && barcode.rawValue.length > 0,
      );
      const code = match?.rawValue?.trim();

      if (!code) {
        return;
      }

      this.stopScanner();
      this.validateTicket(code, TicketValidationMethod.QR_CODE);
    } catch (error) {
      console.error('Failed to detect QR code', error);
      this.scannerError =
        'Unable to read QR code. Adjust the camera and lighting, then try again.';
    }
  }

  submitManual(): void {
    if (this.manualForm.invalid) {
      this.manualForm.markAllAsTouched();
      return;
    }

    const code = this.manualForm.controls.code.value.trim();
    this.validateTicket(code, TicketValidationMethod.MANUAL);
  }

  private validateTicket(code: string, method: TicketValidationMethod): void {
    if (!code) {
      this.validationError = 'Please provide a ticket code.';
      return;
    }

    this.validationError = undefined;
    this.validationResult = undefined;
    this.validating = true;

    this.ticketValidationService
      .validateTicket({ id: code, method })
      .subscribe({
        next: (response) => {
          this.validating = false;
          this.validationResult = {
            ticketId: response.ticketId ?? code,
            status: response.status,
            method,
            code,
            timestamp: new Date(),
          };
        },
        error: (error) => {
          console.error('Ticket validation failed', error);
          this.validating = false;
          this.validationError =
            error?.error?.message ||
            'Unable to validate this ticket right now. Please try again.';
        },
      });
  }

  validationStatusLabel(status?: TicketValidationStatus): string {
    switch (status) {
      case TicketValidationStatus.VALID:
        return 'Ticket is valid';
      case TicketValidationStatus.INVALID:
        return 'Ticket is invalid';
      case TicketValidationStatus.EXPIRED:
        return 'Ticket has expired';
      default:
        return '';
    }
  }

  validationStatusIcon(status?: TicketValidationStatus): string {
    switch (status) {
      case TicketValidationStatus.VALID:
        return 'check_circle';
      case TicketValidationStatus.INVALID:
        return 'cancel';
      case TicketValidationStatus.EXPIRED:
        return 'history_toggle_off';
      default:
        return 'info';
    }
  }

  ngOnDestroy(): void {
    this.stopScanner();
  }
}
