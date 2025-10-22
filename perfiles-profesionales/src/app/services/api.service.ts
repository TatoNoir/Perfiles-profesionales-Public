import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
  status: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Métodos HTTP básicos
  get<T>(endpoint: string, params?: HttpParams): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}${endpoint}`, { params })
      .pipe(catchError(this.handleError));
  }

  post<T>(endpoint: string, body: any, headers?: HttpHeaders): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}${endpoint}`, body, { headers })
      .pipe(catchError(this.handleError));
  }

  put<T>(endpoint: string, body: any, headers?: HttpHeaders): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}${endpoint}`, body, { headers })
      .pipe(catchError(this.handleError));
  }

  patch<T>(endpoint: string, body: any, headers?: HttpHeaders): Observable<T> {
    return this.http.patch<T>(`${this.baseUrl}${endpoint}`, body, { headers })
      .pipe(catchError(this.handleError));
  }

  delete<T>(endpoint: string): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}${endpoint}`)
      .pipe(catchError(this.handleError));
  }

  // Métodos con respuesta tipada
  getApiResponse<T>(endpoint: string, params?: HttpParams): Observable<ApiResponse<T>> {
    return this.get<ApiResponse<T>>(endpoint, params);
  }

  getPaginated<T>(endpoint: string, params?: HttpParams): Observable<PaginatedResponse<T>> {
    return this.get<PaginatedResponse<T>>(endpoint, params);
  }

  // Métodos con autenticación
  getWithAuth<T>(endpoint: string, token: string, params?: HttpParams): Observable<T> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<T>(`${this.baseUrl}${endpoint}`, { headers, params })
      .pipe(catchError(this.handleError));
  }

  postWithAuth<T>(endpoint: string, body: any, token: string): Observable<T> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<T>(`${this.baseUrl}${endpoint}`, body, { headers })
      .pipe(catchError(this.handleError));
  }

  putWithAuth<T>(endpoint: string, body: any, token: string): Observable<T> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put<T>(`${this.baseUrl}${endpoint}`, body, { headers })
      .pipe(catchError(this.handleError));
  }

  // Upload de archivos
  uploadFile<T>(endpoint: string, file: File, token?: string): Observable<T> {
    const formData = new FormData();
    formData.append('file', file);

    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return this.http.post<T>(`${this.baseUrl}${endpoint}`, formData, { headers })
      .pipe(catchError(this.handleError));
  }

  // Manejo de errores
  private handleError(error: any): Observable<never> {
    let errorMessage = 'Ha ocurrido un error';

    if (error.error instanceof ErrorEvent) {
      // Error del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error del servidor
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }

    console.error('API Error:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }

  // Métodos de utilidad
  createParams(params: { [key: string]: string | number | boolean | undefined }): HttpParams {
    let httpParams = new HttpParams();
    Object.keys(params).forEach(key => {
      const value = params[key];
      if (value !== null && value !== undefined) {
        httpParams = httpParams.set(key, value.toString());
      }
    });
    return httpParams;
  }

  createHeaders(additionalHeaders?: { [key: string]: string }): HttpHeaders {
    let headers = new HttpHeaders();

    if (additionalHeaders) {
      Object.keys(additionalHeaders).forEach(key => {
        headers = headers.set(key, additionalHeaders[key]);
      });
    }

    return headers;
  }
}
