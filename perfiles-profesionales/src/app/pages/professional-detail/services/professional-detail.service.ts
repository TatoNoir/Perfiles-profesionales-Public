import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ApiService } from '../../../services/api.service';
import { DataMapperService } from '../../../services/data-mapper.service';
import { ApiProfessionalDetailResponse } from '../../../interfaces/api-response.interface';

export interface ProfessionalDetail {
  id: string;
  skills: string[];
  aboutMe: string;
  workZones: string[];
  province?: string;
  completedProjects: number;
  responseRate: number;
  responseTime: string;
  contactInfo: {
    email: string;
    whatsapp: string;
    instagram: string;
    facebook: string;
    linkedin: string;
  };
  experience: {
    years: number;
    description: string;
  };
  reviewData: {
    averageRating: number;
    totalReviews: number;
    hasReviews: boolean;
  };
  qa: {
    hasQuestions: boolean;
    totalQuestions: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class ProfessionalDetailService {
  constructor(
    private apiService: ApiService,
    private dataMapper: DataMapperService
  ) {}

  // Obtener detalles de un profesional
  public getProfessionalDetail(id: string): Observable<ProfessionalDetail | undefined> {
    return this.apiService.get<ApiProfessionalDetailResponse>(`/api/professionals/${id}`).pipe(
      map(apiResponse => {
        const professionalFull = this.dataMapper.mapApiDetailResponseToProfessionalFull(apiResponse);
        return professionalFull;
      }),
      catchError(error => {
        console.warn('Error al obtener detalles del profesional del endpoint:', error);
        return of(undefined);
      })
    );
  }

  // Obtener información básica del profesional
  public getProfessionalBasic(id: string): Observable<any> {
    return this.apiService.get<any>(`/api/professionals/${id}`).pipe(
      catchError(error => {
        console.warn('Error al obtener información básica del profesional:', error);
        return new Observable(observer => {
          observer.next(null);
          observer.complete();
        });
      })
    );
  }

  /*
  // Obtener estadísticas del profesional
  public getProfessionalStats(id: string): Observable<any> {
    return this.apiService.get<any>(`/api/professionals/${id}/stats`).pipe(
      catchError(error => {
        console.warn('Error al obtener estadísticas del profesional:', error);
        return new Observable(observer => {
          observer.next({
            completedProjects: 0,
            responseRate: 0,
            responseTime: 'N/A'
          });
          observer.complete();
        });
      })
    );
  }

  // Obtener zonas de trabajo
  public getWorkZones(id: string): Observable<string[]> {
    return this.apiService.get<string[]>(`/api/professionals/${id}/work-zones`).pipe(
      catchError(error => {
        console.warn('Error al obtener zonas de trabajo:', error);
        return new Observable(observer => {
          observer.next([]);
          observer.complete();
        });
      })
    );
  }

  // Obtener habilidades
  public getSkills(id: string): Observable<string[]> {
    return this.apiService.get<string[]>(`/api/professionals/${id}/skills`).pipe(
      catchError(error => {
        console.warn('Error al obtener habilidades:', error);
        return new Observable(observer => {
          observer.next([]);
          observer.complete();
        });
      })
    );
  }

  // Verificar si el profesional está disponible
  public checkAvailability(id: string): Observable<{ available: boolean; status: string }> {
    return this.apiService.get<{ available: boolean; status: string }>(`/api/professionals/${id}/availability`).pipe(
      catchError(error => {
        console.warn('Error al verificar disponibilidad:', error);
        return new Observable(observer => {
          observer.next({ available: true, status: 'available' });
          observer.complete();
        });
      })
    );
  }

  */
}
