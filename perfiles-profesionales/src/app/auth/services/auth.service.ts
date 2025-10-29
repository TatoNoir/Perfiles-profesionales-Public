import { Injectable } from '@angular/core';

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
}


