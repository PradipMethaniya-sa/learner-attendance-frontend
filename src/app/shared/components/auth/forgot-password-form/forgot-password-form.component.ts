import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { LabelComponent } from '../../form/label/label.component';
import { ButtonComponent } from '../../ui/button/button.component';
import { InputFieldComponent } from '../../form/input/input-field.component';
import { AuthService } from '../../../services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-forgot-password-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LabelComponent,
    ButtonComponent,
  ],
  templateUrl: './forgot-password-form.component.html',
  styles: ``
})
export class ForgotPasswordFormComponent {
  isLoading = false;
  forgotPasswordForm: FormGroup;

  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSendResetLink() {
    if (this.forgotPasswordForm.invalid) {
      Object.keys(this.forgotPasswordForm.controls).forEach(key => {
        this.forgotPasswordForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.isLoading = true;

    this.authService.forgotPassword({ email: this.forgotPasswordForm.value.email }).pipe(
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe({
      next: (res) => {
        sessionStorage.setItem('resetEmail', this.forgotPasswordForm.value.email);
        this.toastr.success(res.message || 'Password reset link sent. Redirecting to set password page...', 'Success');
        this.router.navigate(['/set-password'], { queryParams: { reset: 'true' } });
      }
    });
  }

  // Helper method to get form controls
  get f() {
    return this.forgotPasswordForm.controls;
  }

  goToSignIn() {
    this.router.navigate(['/signin']);
  }
}
