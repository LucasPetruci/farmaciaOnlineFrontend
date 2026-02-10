import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from '../models/auth.models';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private tokenService = inject(TokenService);

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>('/login', credentials).pipe(
      tap(response => {
        this.tokenService.setToken(response.token);
        this.tokenService.setUser(response.user);
      })
    );
  }

  register(data: RegisterRequest): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>('/register', data).pipe(
      tap(response => {
        this.tokenService.setToken(response.token);
        this.tokenService.setUser(response.user);
      })
    );
  }

  logout(): Observable<void> {
    return this.http.post<void>('/logout', {}).pipe(
      tap(() => {
        this.tokenService.clear();
      })
    );
  }
}
