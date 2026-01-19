import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {

  constructor(private auth: AuthService, private router: Router,private toast: ToastrService) {}

  canActivate(route: any): boolean {
    const allowedRoles = route.data?.roles as string[];
    const userRole = this.auth.getUserRole();

    if (!allowedRoles || allowedRoles.includes(userRole)) {
      return true;
    }

    this.router.navigate(['/']);
    this.toast.error('You do not have permission to access this page.', 'Access Denied');
    return false;
  }
}
