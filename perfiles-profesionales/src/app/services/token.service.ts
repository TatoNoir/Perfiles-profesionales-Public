import { Injectable } from '@angular/core';

export interface TokenData {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: string;
}

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private readonly ACCESS_TOKEN_KEY = 'access_token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';
  private readonly TOKEN_TYPE_KEY = 'token_type';
  private readonly EXPIRES_IN_KEY = 'expires_in';

  constructor() {}

  // Guardar tokens
  setTokens(tokenData: TokenData): void {
    localStorage.setItem(this.ACCESS_TOKEN_KEY, tokenData.accessToken);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, tokenData.refreshToken);
    localStorage.setItem(this.TOKEN_TYPE_KEY, tokenData.tokenType);
    localStorage.setItem(this.EXPIRES_IN_KEY, tokenData.expiresIn.toString());
  }

  // Obtener access token
  getAccessToken(): string | null {
    return localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  // Obtener refresh token
  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  // Obtener tipo de token
  getTokenType(): string | null {
    return localStorage.getItem(this.TOKEN_TYPE_KEY);
  }

  // Obtener tiempo de expiración
  getExpiresIn(): number | null {
    const expiresIn = localStorage.getItem(this.EXPIRES_IN_KEY);
    return expiresIn ? parseInt(expiresIn, 10) : null;
  }

  // Verificar si el token está expirado
  isTokenExpired(): boolean {
    const expiresIn = this.getExpiresIn();
    if (!expiresIn) return true;

    const now = Math.floor(Date.now() / 1000);
    return now >= expiresIn;
  }

  // Verificar si hay tokens válidos
  hasValidToken(): boolean {
    const accessToken = this.getAccessToken();
    const refreshToken = this.getRefreshToken();

    if (!accessToken || !refreshToken) return false;

    return !this.isTokenExpired();
  }

  // Obtener header de autorización
  getAuthorizationHeader(): string | null {
    const token = this.getAccessToken();
    const tokenType = this.getTokenType() || 'Bearer';

    return token ? `${tokenType} ${token}` : null;
  }

  // Limpiar todos los tokens
  clearTokens(): void {
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.TOKEN_TYPE_KEY);
    localStorage.removeItem(this.EXPIRES_IN_KEY);
  }

  // Obtener todos los datos del token
  getTokenData(): TokenData | null {
    const accessToken = this.getAccessToken();
    const refreshToken = this.getRefreshToken();
    const tokenType = this.getTokenType();
    const expiresIn = this.getExpiresIn();

    if (!accessToken || !refreshToken || !tokenType || !expiresIn) {
      return null;
    }

    return {
      accessToken,
      refreshToken,
      tokenType,
      expiresIn
    };
  }

  // Actualizar solo el access token
  updateAccessToken(newAccessToken: string, newExpiresIn: number): void {
    localStorage.setItem(this.ACCESS_TOKEN_KEY, newAccessToken);
    localStorage.setItem(this.EXPIRES_IN_KEY, newExpiresIn.toString());
  }

  // Verificar si el usuario está autenticado
  isAuthenticated(): boolean {
    return this.hasValidToken();
  }

  // Obtener tiempo restante del token en segundos
  getTokenTimeRemaining(): number {
    const expiresIn = this.getExpiresIn();
    if (!expiresIn) return 0;

    const now = Math.floor(Date.now() / 1000);
    return Math.max(0, expiresIn - now);
  }

  // Obtener tiempo restante del token en minutos
  getTokenTimeRemainingMinutes(): number {
    return Math.floor(this.getTokenTimeRemaining() / 60);
  }
}
