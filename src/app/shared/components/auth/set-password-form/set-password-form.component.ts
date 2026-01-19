import { Component } from '@angular/core';
import { LabelComponent } from '../../form/label/label.component';
import { ButtonComponent } from '../../ui/button/button.component';
import { InputFieldComponent } from '../../form/input/input-field.component';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-set-password-form',
  imports: [
    LabelComponent,
    ButtonComponent,
    InputFieldComponent,
    RouterModule,
    FormsModule
  ],
  templateUrl: './set-password-form.component.html',
  styles: ``
})
export class SetPasswordFormComponent {
  showCurrentPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;
  isLoading = false;
  errorMessage = '';

  currentPassword = '';
  newPassword = '';
  confirmPassword = '';

  constructor(
    private authService: AuthService,
    private toastr: ToastrService
  ) {}

  togglePasswordVisibility(field: 'current' | 'new' | 'confirm') {
    switch (field) {
      case 'current':
        this.showCurrentPassword = !this.showCurrentPassword;
        break;
      case 'new':
        this.showNewPassword = !this.showNewPassword;
        break;
      case 'confirm':
        this.showConfirmPassword = !this.showConfirmPassword;
        break;
    }
  }

  validateForm(): boolean {
    this.errorMessage = '';

    if (!this.currentPassword || !this.newPassword || !this.confirmPassword) {
      this.errorMessage = 'All fields are required';
      return false;
    }

    if (this.newPassword === this.currentPassword) {
      this.errorMessage = 'New password must be different from current password';
      return false;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.errorMessage = 'Confirm password must match new password';
      return false;
    }

    if (this.newPassword.length < 6) {
      this.errorMessage = 'Password must be at least 6 characters long';
      return false;
    }

    return true;
  }

  onSetPassword() {
    if (!this.validateForm()) {
      return;
    }

    const tempToken = this.authService.getTempToken();
    if (!tempToken) {
      this.errorMessage = 'Session expired. Please login again.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const request = {
      tempToken,
      currentPassword: this.currentPassword,
      newPassword: this.newPassword,
      confirmPassword: this.confirmPassword
    };

    this.authService.setPassword(request).subscribe({
      next: (success) => {
        this.isLoading = false;
        if (success) {
          this.toastr.success('Password changed successfully. Please login with your new password.', 'Success');
        } else {
          this.errorMessage = 'Failed to change password. Please try again.';
        }
      },
      error: () => {
        this.isLoading = false;
        this.errorMessage = 'An error occurred. Please try again.';
      }
    });
  }
}
