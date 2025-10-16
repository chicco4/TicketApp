import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

export interface ForbiddenDialogData {
  requiredRole: string;
  attemptedRoute: string;
}

@Component({
  selector: 'app-forbidden-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <h2 mat-dialog-title>
      <mat-icon>block</mat-icon>
      Access Denied
    </h2>
    <mat-dialog-content>
      <p>You don't have permission to access this page.</p>
      <div class="details">
        <p><strong>Required Role:</strong> {{ formatRole(data.requiredRole) }}</p>
        <p><strong>Attempted Route:</strong> {{ data.attemptedRoute }}</p>
      </div>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-button (click)="goBack()">Go Back</button>
      <button mat-flat-button color="primary" (click)="goHome()">
        <mat-icon>home</mat-icon>
        Go Home
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    h2 {
      display: flex;
      align-items: center;
      gap: 8px;
      
      mat-icon {
        color: var(--mat-sys-error);
      }
    }

    .details {
      margin-top: 16px;
      padding: 12px;
      background-color: var(--mat-sys-surface-container);
      border-radius: 8px;
      
      p {
        margin: 4px 0;
        font-size: 0.875rem;
        
        strong {
          display: inline-block;
          min-width: 120px;
        }
      }
    }

    mat-dialog-actions {
      justify-content: flex-end;
      gap: 8px;
      
      button mat-icon {
        margin-right: 4px;
      }
    }
  `]
})
export class ForbiddenDialog {
  protected readonly dialogRef = inject(MatDialogRef<ForbiddenDialog>);
  protected readonly data = inject<ForbiddenDialogData>(MAT_DIALOG_DATA);
  private readonly router = inject(Router);

  protected formatRole(role: string): string {
    return role.replace(/^ROLE_/i, '').toLowerCase()
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  protected goBack(): void {
    this.dialogRef.close();
  }

  protected goHome(): void {
    this.dialogRef.close();
    this.router.navigate(['/']);
  }
}
