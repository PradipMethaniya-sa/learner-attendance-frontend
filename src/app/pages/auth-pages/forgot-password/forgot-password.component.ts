import { Component } from '@angular/core';
import { AuthPageLayoutComponent } from '../../../shared/layout/auth-page-layout/auth-page-layout.component';
import { ForgotPasswordFormComponent } from '../../../shared/components/auth/forgot-password-form/forgot-password-form.component';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    AuthPageLayoutComponent,
    ForgotPasswordFormComponent,
  ],
  templateUrl: './forgot-password.component.html',
  styles: ``
})
export class ForgotPasswordComponent {
}
