import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface ConfirmDialogData {
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  type: 'danger' | 'warning' | 'info';
}

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent {
  @Input() data: ConfirmDialogData = {
    title: 'Confirm Action',
    message: 'Are you sure you want to proceed?',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    type: 'info'
  };

  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  getIconClass(): string {
    switch (this.data.type) {
      case 'danger':
        return 'text-red-600 dark:text-red-400';
      case 'warning':
        return 'text-yellow-600 dark:text-yellow-400';
      default:
        return 'text-blue-600 dark:text-blue-400';
    }
  }

  getIconName(): string {
    switch (this.data.type) {
      case 'danger':
        return 'delete';
      case 'warning':
        return 'warning';
      default:
        return 'info';
    }
  }

  getConfirmButtonClass(): string {
    switch (this.data.type) {
      case 'danger':
        return 'bg-red-500 text-white shadow-theme-xs hover:bg-red-600 disabled:bg-red-300';
      case 'warning':
        return 'bg-yellow-500 text-white shadow-theme-xs hover:bg-yellow-600 disabled:bg-yellow-300';
      default:
        return 'bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300';
    }
  }

  onConfirm(): void {
    this.confirm.emit();
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
