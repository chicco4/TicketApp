import { CommonModule } from '@angular/common';
import { Component, input, output, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';

export interface QuickGuideStep {
  icon: string;
  text: string;
}

@Component({
  selector: 'app-quick-guide-card',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatListModule],
  templateUrl: './quick-guide-card.html',
  styleUrl: './quick-guide-card.css',
})
export class QuickGuideCardComponent {
  readonly title = input.required<string>();
  readonly subtitle = input.required<string>();
  readonly steps = input.required<QuickGuideStep[]>();
  readonly avatarIcon = input('explore');

  readonly dismissed = output<void>();

  private readonly hidden = signal(false);

  dismiss(): void {
    if (this.hidden()) {
      return;
    }
    this.hidden.set(true);
    this.dismissed.emit();
  }

  protected isHidden(): boolean {
    return this.hidden();
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.dismiss();
    }
  }
}
