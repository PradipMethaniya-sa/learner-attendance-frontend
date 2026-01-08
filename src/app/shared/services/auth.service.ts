import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  data: {
    token: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'access_token';
  private readonly API_BASE_URL = environment.API_URL; // Update with your API base URL

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  login(credentials: LoginRequest): Observable<boolean> {
    return this.http.post<LoginResponse>(`${this.API_BASE_URL}/auth/login`, credentials).pipe(
      map(response => {
        if (response.data && response.data.token) {
          this.setToken(response.data.token);
          this.router.navigate(['/schools']);
          return true;
        }
        return false;
      }),
      catchError(() => {
        return of(false);
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this.router.navigate(['/signin']);
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token;
  }

  getToken(): string | null {
    const token = localStorage.getItem(this.TOKEN_KEY);
    console.log('AuthService: Retrieved token:', token ? token.substring(0, 20) + '...' : 'null');
    return token;
  }

  private setToken(token: string): void {
    console.log('AuthService: Storing token:', token.substring(0, 20) + '...');
    localStorage.setItem(this.TOKEN_KEY, token);
    console.log('AuthService: Token stored successfully');
  }
}
