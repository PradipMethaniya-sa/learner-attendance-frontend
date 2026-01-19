import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class SetPasswordGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): boolean {
    const tempToken = this.authService.getTempToken();
    
    // Allow access only if tempToken exists
    if (tempToken) {
      return true;
    }
    
    // If no tempToken, redirect to login
    this.router.navigate(['/signin']);
    return false;
  }
}
