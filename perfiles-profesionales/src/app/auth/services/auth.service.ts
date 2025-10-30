import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../services/api.service';

interface StoredUser {
  id: number;
  email: string;
  user_type_id?: number;
  name?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'pp_auth_token';
  private readonly USER_KEY = 'pp_auth_user';

  constructor(private api: ApiService) {}

  login(token: string, user: StoredUser) {
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  logout() {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getUser(): StoredUser | null {
    const raw = localStorage.getItem(this.USER_KEY);
    return raw ? (JSON.parse(raw) as StoredUser) : null;
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  isProfessional(): boolean {
    const u = this.getUser();
    return !!u && u.user_type_id === 2;
  }

  // Login de profesionales contra el backend
  professionalLogin(payload: { email: string; password: string }): Observable<any> {
    return this.api.post<any>('/api/professionals/login', payload);
  }
}


