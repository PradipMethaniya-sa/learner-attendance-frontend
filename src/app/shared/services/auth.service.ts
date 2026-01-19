import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ToastrService } from 'ngx-toastr';

export interface LoginRequest {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'access_token';
  private readonly TEMP_TOKEN_KEY = 'temp_token';
  private readonly USER_DATA_KEY = 'userData';
  private readonly API_BASE_URL = environment.API_URL; // Update with your API base URL

  constructor(
    private http: HttpClient,
    private router: Router,
    private toastr: ToastrService
  ) {}

  login(credentials: LoginRequest): Observable<{ success: boolean; isFirstTime: boolean }> {
    return this.http.post<any>(`${this.API_BASE_URL}/auth/login`, credentials).pipe(
      map((response: any) => {
        if (response.success && response.data) {
          if (response.data.requiresPasswordChange && response.data.tempToken) {
            // First-time login - store temp token and redirect to set password
            this.setTempToken(response.data.tempToken);
            this.router.navigate(['/set-password']);
            return { success: true, isFirstTime: true };
          } else if (response.data.token) {
            // Normal login - store auth token and get user profile
            this.setToken(response.data.token);
            this.getUserProfile().subscribe({
              next: (profile) => {
                this.setUserData(profile);
                this.router.navigate(['/schools']);
              },
              error: () => {
                this.router.navigate(['/schools']);
              }
            });
            return { success: true, isFirstTime: false };
          }
        }
        return { success: false, isFirstTime: false };
      }),
      catchError(() => {
        return of({ success: false, isFirstTime: false });
      })
    );
  }

  setPassword(request: any): Observable<boolean> {
    return this.http.post<any>(`${this.API_BASE_URL}/auth/change-password`, request).pipe(
      map((response: any) => {
        if (response.success) {
          this.clearTempToken();
          this.router.navigate(['/signin']);
          return true;
        }
        return false;
      }),
      catchError(() => {
        return of(false);
      })
    );
  }

  getUserProfile(): Observable<any> {
    const token = this.getToken();
    const headers: { [key: string]: string } = {};
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    return this.http.get<any>(`${this.API_BASE_URL}/auth/me`, { headers }).pipe(
      map((response: any) => response.data)
    );
  }

  logout(): void {
    this.http.post<any>(`${this.API_BASE_URL}/auth/logout`, {}).subscribe({
      next: (res) => {
        this.toastr.success(res.message || 'Logged out successfully');
      }
    });
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_DATA_KEY);
    localStorage.removeItem(this.TEMP_TOKEN_KEY);
    this.router.navigate(['/signin']);
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token;
  }

  getToken(): string | null {
    const token = localStorage.getItem(this.TOKEN_KEY);
    return token;
  }

  getTempToken(): string | null {
    return localStorage.getItem(this.TEMP_TOKEN_KEY);
  }

  getUserData(): any {
    const userData = localStorage.getItem(this.USER_DATA_KEY);
    return userData ? JSON.parse(userData) : null;
  }

  private setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  private setTempToken(tempToken: string): void {
    localStorage.setItem(this.TEMP_TOKEN_KEY, tempToken);
  }

  private setUserData(userData: any): void {
    localStorage.setItem(this.USER_DATA_KEY, JSON.stringify(userData));
  }

  private clearTempToken(): void {
    localStorage.removeItem(this.TEMP_TOKEN_KEY);
  }
}
