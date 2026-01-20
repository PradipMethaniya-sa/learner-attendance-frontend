import { Component } from '@angular/core';
import { DropdownComponent } from '../../ui/dropdown/dropdown.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DropdownItemTwoComponent } from '../../ui/dropdown/dropdown-item/dropdown-item.component-two';
import { AuthService } from '../../../services/auth.service';
import { ConfirmDialogComponent } from '../../confirm-dialog';

@Component({
  selector: 'app-user-dropdown',
  templateUrl: './user-dropdown.component.html',
  imports: [CommonModule, RouterModule, DropdownComponent, ConfirmDialogComponent]
})
export class UserDropdownComponent {
  isOpen = false;
  confirmDialogData: any
  showConfirmDialog = false;
  userData!: any;
  constructor(private authService: AuthService) { 
    this.userData = this.authService.getUserData();
  }

  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  closeDropdown() {
    this.isOpen = false;
  }

  logout(): void {
    this.confirmDialogData = {
      title: 'Logout Confirmation',
      message: 'Are you sure you want to logout?',
      confirmText: 'Logout',
      cancelText: 'Cancel',
      type: 'danger'
    };

    this.showConfirmDialog = true;
  }

  onConfirmDialog(): void {
    this.authService.logout();
    this.showConfirmDialog = false;
  }

  closeConfirmDialog(): void {
    this.showConfirmDialog = false;
  }
}