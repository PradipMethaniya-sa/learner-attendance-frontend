
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LabelComponent } from '../../form/label/label.component';
import { CheckboxComponent } from '../../form/input/checkbox.component';
import { ButtonComponent } from '../../ui/button/button.component';
import { InputFieldComponent } from '../../form/input/input-field.component';
import { RouterModule } from '@angular/router';
import { AuthService, LoginRequest } from '../../../services/auth.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-signin-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    LabelComponent,
    CheckboxComponent,
    ButtonComponent,
    RouterModule
  ],
  templateUrl: './signin-form.component.html',
  styles: ``
})
export class SigninFormComponent {
  showPassword = false;
  isChecked = false;
  isLoading = false;
  signinForm!: FormGroup;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.initializeForm();
  }

  private initializeForm() {
    this.signinForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onSignIn() {
    if (this.signinForm.invalid) {
      // Mark all fields as touched to show validation messages
      Object.keys(this.signinForm.controls).forEach(key => {
        this.signinForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.isLoading = true;

    const loginRequest: LoginRequest = {
      email: this.signinForm.value.email,
      password: this.signinForm.value.password
    };

    this.authService.login(loginRequest).pipe(
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe({
      next: () => {
        // Success and navigation handled by auth service
      }
    });
  }

  // Helper method to get form controls
  get f() {
    return this.signinForm.controls;
  }
}
