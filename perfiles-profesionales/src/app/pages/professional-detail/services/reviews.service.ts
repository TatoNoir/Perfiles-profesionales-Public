import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiService } from '../../../services/api.service';

export interface Review {
  id: string;
  professionalId: string;
  clientName: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  verified: boolean;
}

export interface ReviewForm {
  name: string;
  rating: number;
  title: string;
  comment: string;
}

export interface ReviewResponse {
  success: boolean;
  message: string;
  review?: Review;
}

export interface ReviewStats {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class ReviewsService {
  constructor(private apiService: ApiService) {}

  // Obtener reseñas de un profesional
  public getReviews(professionalId: string, page: number = 1, limit: number = 10): Observable<{ reviews: Review[], total: number, page: number, totalPages: number }> {
    return this.apiService.get<{ reviews: Review[], total: number, page: number, totalPages: number }>(
      `/api/professionals/${professionalId}/reviews?page=${page}&limit=${limit}`
    ).pipe(
      catchError(error => {
        console.warn('Error al obtener reseñas:', error);
        return new Observable(observer => {
          observer.next({
            reviews: [],
            total: 0,
            page: 1,
            totalPages: 0
          });
          observer.complete();
        });
      })
    );
  }

  // Crear nueva reseña
  public createReview(professionalId: string, reviewData: ReviewForm): Observable<ReviewResponse> {
    return this.apiService.post<ReviewResponse>(`/api/professionals/${professionalId}/reviews`, reviewData).pipe(
      catchError(error => {
        console.error('Error al crear reseña:', error);
        return new Observable(observer => {
          observer.next({
            success: false,
            message: 'Error al crear la reseña'
          });
          observer.complete();
        });
      })
    );
  }

  // Obtener estadísticas de reseñas
  public getReviewStats(professionalId: string): Observable<ReviewStats> {
    return this.apiService.get<ReviewStats>(`/api/professionals/${professionalId}/reviews/stats`).pipe(
      catchError(error => {
        console.warn('Error al obtener estadísticas de reseñas:', error);
        return new Observable(observer => {
          observer.next({
            averageRating: 0,
            totalReviews: 0,
            ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
          });
          observer.complete();
        });
      })
    );
  }

  // Obtener reseñas recientes
  public getRecentReviews(professionalId: string, limit: number = 5): Observable<Review[]> {
    return this.apiService.get<Review[]>(`/api/professionals/${professionalId}/reviews/recent?limit=${limit}`).pipe(
      catchError(error => {
        console.warn('Error al obtener reseñas recientes:', error);
        return new Observable(observer => {
          observer.next([]);
          observer.complete();
        });
      })
    );
  }

  // Obtener reseñas por calificación
  public getReviewsByRating(professionalId: string, rating: number): Observable<Review[]> {
    return this.apiService.get<Review[]>(`/api/professionals/${professionalId}/reviews?rating=${rating}`).pipe(
      catchError(error => {
        console.warn('Error al obtener reseñas por calificación:', error);
        return new Observable(observer => {
          observer.next([]);
          observer.complete();
        });
      })
    );
  }

  // Reportar reseña inapropiada
  public reportReview(reviewId: string, reason: string): Observable<{ success: boolean }> {
    return this.apiService.post<{ success: boolean }>(`/api/reviews/${reviewId}/report`, { reason }).pipe(
      catchError(error => {
        console.error('Error al reportar reseña:', error);
        return new Observable(observer => {
          observer.next({ success: false });
          observer.complete();
        });
      })
    );
  }

  // Obtener reseñas verificadas
  public getVerifiedReviews(professionalId: string): Observable<Review[]> {
    return this.apiService.get<Review[]>(`/api/professionals/${professionalId}/reviews/verified`).pipe(
      catchError(error => {
        console.warn('Error al obtener reseñas verificadas:', error);
        return new Observable(observer => {
          observer.next([]);
          observer.complete();
        });
      })
    );
  }

  // Obtener reseñas con imágenes
  public getReviewsWithImages(professionalId: string): Observable<Review[]> {
    return this.apiService.get<Review[]>(`/api/professionals/${professionalId}/reviews/with-images`).pipe(
      catchError(error => {
        console.warn('Error al obtener reseñas con imágenes:', error);
        return new Observable(observer => {
          observer.next([]);
          observer.complete();
        });
      })
    );
  }

  // Obtener reseñas destacadas
  public getFeaturedReviews(professionalId: string): Observable<Review[]> {
    return this.apiService.get<Review[]>(`/api/professionals/${professionalId}/reviews/featured`).pipe(
      catchError(error => {
        console.warn('Error al obtener reseñas destacadas:', error);
        return new Observable(observer => {
          observer.next([]);
          observer.complete();
        });
      })
    );
  }
}
