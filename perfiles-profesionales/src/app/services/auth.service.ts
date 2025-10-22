import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { ApiService } from './api.service';
import { TokenService } from './token.service';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'user' | 'admin' | 'professional';
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  tokens: {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    tokenType: string;
  };
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
  confirmPassword: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(
    private apiService: ApiService,
    private tokenService: TokenService
  ) {
    this.initializeAuth();
  }

  // Inicializar estado de autenticación
  private initializeAuth(): void {
    const isAuthenticated = this.tokenService.isAuthenticated();
    this.isAuthenticatedSubject.next(isAuthenticated);

    if (isAuthenticated) {
      this.getCurrentUser().subscribe();
    }
  }

  // Login
  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.apiService.post<AuthResponse>('/auth/login', credentials).pipe(
      tap(response => {
        this.tokenService.setTokens(response.tokens);
        this.currentUserSubject.next(response.user);
        this.isAuthenticatedSubject.next(true);
      }),
      catchError(error => {
        console.error('Login error:', error);
        return throwError(() => error);
      })
    );
  }

  // Registro
  register(userData: RegisterRequest): Observable<AuthResponse> {
    return this.apiService.post<AuthResponse>('/auth/register', userData).pipe(
      tap(response => {
        this.tokenService.setTokens(response.tokens);
        this.currentUserSubject.next(response.user);
        this.isAuthenticatedSubject.next(true);
      }),
      catchError(error => {
        console.error('Register error:', error);
        return throwError(() => error);
      })
    );
  }

  // Logout
  logout(): Observable<any> {
    const refreshToken = this.tokenService.getRefreshToken();

    if (refreshToken) {
      return this.apiService.post('/auth/logout', { refreshToken }).pipe(
        tap(() => {
          this.clearAuthData();
        }),
        catchError(error => {
          // Incluso si el logout falla en el servidor, limpiar datos locales
          this.clearAuthData();
          return throwError(() => error);
        })
      );
    } else {
      this.clearAuthData();
      return new Observable(observer => {
        observer.next({});
        observer.complete();
      });
    }
  }

  // Obtener usuario actual
  getCurrentUser(): Observable<User> {
    return this.apiService.getWithAuth<User>('/auth/me', this.tokenService.getAccessToken()!).pipe(
      tap(user => {
        this.currentUserSubject.next(user);
      }),
      catchError(error => {
        console.error('Get current user error:', error);
        this.clearAuthData();
        return throwError(() => error);
      })
    );
  }

  // Actualizar perfil
  updateProfile(userData: Partial<User>): Observable<User> {
    return this.apiService.putWithAuth<User>('/auth/profile', userData, this.tokenService.getAccessToken()!).pipe(
      tap((user: User) => {
        this.currentUserSubject.next(user);
      }),
      catchError(error => {
        console.error('Update profile error:', error);
        return throwError(() => error);
      })
    );
  }

  // Cambiar contraseña
  changePassword(currentPassword: string, newPassword: string): Observable<any> {
    return this.apiService.postWithAuth('/auth/change-password', {
      currentPassword,
      newPassword
    }, this.tokenService.getAccessToken()!).pipe(
      catchError(error => {
        console.error('Change password error:', error);
        return throwError(() => error);
      })
    );
  }

  // Olvidar contraseña
  forgotPassword(email: string): Observable<any> {
    return this.apiService.post('/auth/forgot-password', { email }).pipe(
      catchError(error => {
        console.error('Forgot password error:', error);
        return throwError(() => error);
      })
    );
  }

  // Resetear contraseña
  resetPassword(token: string, password: string): Observable<any> {
    return this.apiService.post('/auth/reset-password', { token, password }).pipe(
      catchError(error => {
        console.error('Reset password error:', error);
        return throwError(() => error);
      })
    );
  }

  // Refrescar token
  refreshToken(): Observable<AuthResponse> {
    const refreshToken = this.tokenService.getRefreshToken();

    if (!refreshToken) {
      return throwError(() => new Error('No refresh token available'));
    }

    return this.apiService.post<AuthResponse>('/auth/refresh', { refreshToken }).pipe(
      tap(response => {
        this.tokenService.setTokens(response.tokens);
        this.currentUserSubject.next(response.user);
        this.isAuthenticatedSubject.next(true);
      }),
      catchError(error => {
        console.error('Refresh token error:', error);
        this.clearAuthData();
        return throwError(() => error);
      })
    );
  }

  // Verificar email
  verifyEmail(token: string): Observable<any> {
    return this.apiService.post('/auth/verify-email', { token }).pipe(
      catchError(error => {
        console.error('Verify email error:', error);
        return throwError(() => error);
      })
    );
  }

  // Reenviar verificación
  resendVerification(): Observable<any> {
    return this.apiService.post('/auth/resend-verification', {}).pipe(
      catchError(error => {
        console.error('Resend verification error:', error);
        return throwError(() => error);
      })
    );
  }

  // Limpiar datos de autenticación
  private clearAuthData(): void {
    this.tokenService.clearTokens();
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
  }

  // Getters
  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }

  get isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  // Verificar si el usuario tiene un rol específico
  hasRole(role: string): boolean {
    const user = this.currentUser;
    return user ? user.role === role : false;
  }

  // Verificar si el usuario es admin
  isAdmin(): boolean {
    return this.hasRole('admin');
  }

  // Verificar si el usuario es profesional
  isProfessional(): boolean {
    return this.hasRole('professional');
  }

  // Verificar si el usuario está verificado
  isVerified(): boolean {
    const user = this.currentUser;
    return user ? user.isVerified : false;
  }
}
