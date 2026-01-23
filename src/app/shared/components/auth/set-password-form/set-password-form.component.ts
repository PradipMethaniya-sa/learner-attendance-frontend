import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { LabelComponent } from '../../form/label/label.component';
import { ButtonComponent } from '../../ui/button/button.component';
import { InputFieldComponent } from '../../form/input/input-field.component';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-set-password-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LabelComponent,
    ButtonComponent,
    RouterModule
  ],
  templateUrl: './set-password-form.component.html',
  styles: ``
})
export class SetPasswordFormComponent {
  showCurrentPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;
  showOtp = false;
  isLoading = false;

  setPasswordForm!: FormGroup;
  isResetMode = false;
  pageTitle = 'Set Password';
  pageDescription = 'This is your first time logging in. Please set a new password to continue.';
  email = '';

  constructor(
    private authService: AuthService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.checkResetMode();
    this.initializeForm();
  }

  private checkResetMode() {
    this.route.queryParams.subscribe(params => {
      if (params['reset'] === 'true') {
        this.isResetMode = true;
        this.pageTitle = 'Reset Password';
        this.pageDescription = 'Enter the OTP sent to your email and set a new password.';
        this.email = sessionStorage.getItem('resetEmail') || '';
      }
    });
  }

  private initializeForm() {
    const formConfig: any = {
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    };

    if (this.isResetMode) {
      formConfig.otp = ['', Validators.required];
    } else {
      formConfig.currentPassword = ['', Validators.required];
    }

    this.setPasswordForm = this.fb.group(formConfig, {
      validators: this.passwordMatchValidator
    });
  }

  private passwordMatchValidator(formGroup: FormGroup) {
    const newPassword = formGroup.get('newPassword')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;
    
    if (newPassword !== confirmPassword) {
      formGroup.get('confirmPassword')?.setErrors({ passwordMismatch: true });
    } else {
      formGroup.get('confirmPassword')?.setErrors(null);
    }
  }

  togglePasswordVisibility(field: 'current' | 'new' | 'confirm' | 'otp') {
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
      case 'otp':
        this.showOtp = !this.showOtp;
        break;
    }
  }

  onSetPassword() {
    if (this.setPasswordForm.invalid) {
      // Mark all fields as touched to show validation messages
      Object.keys(this.setPasswordForm.controls).forEach(key => {
        this.setPasswordForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.isLoading = true;

    if (this.isResetMode) {
      this.handlePasswordReset();
    } else {
      this.handleFirstTimeSetup();
    }
  }

  private handleFirstTimeSetup() {
    const tempToken = this.authService.getTempToken();
    if (!tempToken) {
      // Error handled by interceptor
      this.isLoading = false;
      return;
    }

    const request = {
      tempToken,
      currentPassword: this.setPasswordForm.value.currentPassword,
      newPassword: this.setPasswordForm.value.newPassword,
      confirmPassword: this.setPasswordForm.value.confirmPassword
    };

    this.authService.setPassword(request).pipe(
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe({
      next: (res) => {
        this.toastr.success(res.message || 'Password set successfully. Please login with your new password.', 'Success');
      }
    });
  }

  private handlePasswordReset() {
    const request = {
      email: this.email,
      otp: this.setPasswordForm.value.otp,
      newPassword: this.setPasswordForm.value.newPassword
    };

    this.authService.resetPasswordWithOtp(request).pipe(
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe({
      next: (res) => {
        this.toastr.success(res.message || 'Password reset successfully. Please login with your new password.', 'Success');
        this.router.navigate(['/signin']);
      }
    });
  }

  // Helper method to get form controls
  get f() {
    return this.setPasswordForm.controls;
  }
}
