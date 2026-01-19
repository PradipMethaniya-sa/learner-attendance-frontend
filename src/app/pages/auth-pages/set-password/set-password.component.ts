import { Component } from '@angular/core';
import { AuthPageLayoutComponent } from '../../../shared/layout/auth-page-layout/auth-page-layout.component';
import { SetPasswordFormComponent } from '../../../shared/components/auth/set-password-form/set-password-form.component';

@Component({
  selector: 'app-set-password',
  imports: [
    AuthPageLayoutComponent,
    SetPasswordFormComponent
  ],
  templateUrl: './set-password.component.html',
  styles: ``
})
export class SetPasswordComponent {
  
}
