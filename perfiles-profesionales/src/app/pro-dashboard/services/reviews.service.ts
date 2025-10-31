import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../auth/services/auth.service';

export interface ReviewUser {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  document_type: string;
  document_number: string;
  birth_date: string;
  nationality: string;
  country_phone: string;
  area_code: string;
  phone_number: string;
  email: string;
  email_verified_at: string | null;
  is_active: boolean;
  profile_picture: string | null;
  description: string;
  created_at: string;
  updated_at: string;
  locality_id: number;
  zone: string | null;
  address: string;
  street: string;
  street_number: string;
  floor: string;
  apartment: string;
  user_type_id: number;
}

export interface Review {
  id: number;
  name: string;
  email: string;
  value: number;
  comment: string | null;
  answer: string | null;
  published: boolean;
  user_id: number;
  title: string | null;
  proyect_type: string | null;
  created_at: string;
  updated_at: string;
  user: ReviewUser;
}

export interface ReviewsResponse {
  data: Review[];
}

export interface AnswerReviewRequest {
  answer: string;
}

@Injectable({
  providedIn: 'root'
})
export class ReviewsService {
  private readonly endpoint = '/api/professionals/get/reviews';

  constructor(
    private apiService: ApiService,
    private authService: AuthService
  ) {}

  /**
   * Obtiene la lista de valoraciones con un límite específico
   * @param limit Número de valoraciones a obtener (5 para overview, 20 para la sección completa)
   * @returns Observable con la lista de reviews
   */
  getReviews(limit: number = 20): Observable<Review[]> {
    const token = this.authService.getToken();
    if (!token) {
      throw new Error('No hay token de autenticación disponible');
    }

    const params = this.apiService.createParams({ limit: limit.toString() });

    return this.apiService.getWithAuth<ReviewsResponse>(
      this.endpoint,
      token,
      params
    ).pipe(
      map((response: ReviewsResponse) => response.data || []),
      catchError(error => {
        console.error('Error al obtener reviews:', error);
        throw error;
      })
    );
  }

  /**
   * Obtiene las últimas valoraciones para el overview (límite de 5)
   * @returns Observable con las últimas 5 reviews
   */
  getOverviewReviews(): Observable<Review[]> {
    return this.getReviews(5);
  }

  /**
   * Obtiene todas las valoraciones para la sección completa (límite de 20)
   * @returns Observable con las reviews
   */
  getAllReviews(): Observable<Review[]> {
    return this.getReviews(20);
  }

  /**
   * Responde a una valoración
   * @param reviewId ID de la valoración
   * @param answer Texto de la respuesta
   * @returns Observable con la review actualizada
   */
  respondToReview(reviewId: number, answer: string): Observable<Review> {
    const token = this.authService.getToken();
    if (!token) {
      throw new Error('No hay token de autenticación disponible');
    }

    const body: AnswerReviewRequest = { answer };
    const endpoint = `/api/professionals/respond/review/${reviewId}`;

    return this.apiService.postWithAuth<ReviewsResponse>(
      endpoint,
      body,
      token
    ).pipe(
      map((response: any) => {
        // La respuesta puede venir como { data: Review } o directamente como Review
        return response.data || response;
      }),
      catchError(error => {
        console.error('Error al responder la valoración:', error);
        throw error;
      })
    );
  }

  /**
   * Modifica la respuesta de una valoración existente
   * @param reviewId ID de la valoración
   * @param answer Nuevo texto de la respuesta
   * @returns Observable con la review actualizada
   */
  updateReviewAnswer(reviewId: number, answer: string): Observable<Review> {
    const token = this.authService.getToken();
    if (!token) {
      throw new Error('No hay token de autenticación disponible');
    }

    const body: AnswerReviewRequest = { answer };
    const endpoint = `/api/professionals/reviews/${reviewId}/answer`;

    return this.apiService.putWithAuth<ReviewsResponse>(
      endpoint,
      body,
      token
    ).pipe(
      map((response: any) => {
        // La respuesta puede venir como { data: Review } o directamente como Review
        return response.data || response;
      }),
      catchError(error => {
        console.error('Error al actualizar la respuesta:', error);
        throw error;
      })
    );
  }
}

