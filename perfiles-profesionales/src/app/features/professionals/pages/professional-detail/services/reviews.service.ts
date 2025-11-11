import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ApiService } from '../../../../../core/services/api.service';
import { Review } from '../../../../../shared/interfaces/api-response.interface';

export interface ReviewForm {
  value: number;
  email: string;
  name: string;
  comment: string;
  user_id: number;
  title: string;
  project_type: string;
}

export interface ReviewResponse {
  message: string;
  data: {
    value: number;
    email: string;
    name: string;
    comment: string;
    user_id: number;
    title: string;
    project_type: string;
    answer?: string;
    published: number;
    created_at: string;
    updated_at: string;
    id: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class ReviewsService {
  constructor(private apiService: ApiService) {}

  /**
   * Envía una nueva valoración
   */
  public sendReview(reviewData: ReviewForm): Observable<ReviewResponse> {
    return this.apiService.post<ReviewResponse>('/api/common/reviews', reviewData).pipe(
      catchError(error => {
        console.error('Error al enviar valoración:', error);

        // Determinar el tipo de error y mensaje apropiado
        let errorMessage = 'Error al enviar la valoración';
        if (error.status === 400) {
          errorMessage = 'Datos inválidos. Por favor, revisa la información ingresada.';
        } else if (error.status === 401) {
          errorMessage = 'No autorizado. Por favor, inicia sesión.';
        } else if (error.status === 403) {
          errorMessage = 'No tienes permisos para realizar esta acción.';
        } else if (error.status === 422) {
          errorMessage = 'Los datos enviados no son válidos.';
        } else if (error.status === 500) {
          errorMessage = 'Error del servidor. Inténtalo más tarde.';
        } else if (error.status === 0) {
          errorMessage = 'Error de conexión. Verifica tu internet.';
        }

        return new Observable(observer => {
          observer.next({
            message: errorMessage,
            data: {
              value: 0,
              email: '',
              name: '',
              comment: '',
              user_id: 0,
              title: '',
              project_type: '',
              published: 0,
              created_at: '',
              updated_at: '',
              id: 0
            }
          });
          observer.complete();
        });
      })
    );
  }

  /**
   * Obtiene las valoraciones de un profesional con paginación
   * @param professionalId - ID del profesional
   * @param page - Número de página (default: 1)
   * @param limit - Cantidad de resultados por página (default: 5)
   */
  public getReviews(professionalId: string, page: number = 1, limit: number = 5): Observable<{ reviews: Review[], total: number, page: number, totalPages: number }> {
    let params = this.apiService.createParams({
      page: page.toString(),
      limit: limit.toString()
    });

    return this.apiService.get<{ data: Review[], total: number, page: number, total_pages: number }>(
      `/api/professionals/${professionalId}/get/reviews`,
      params
    ).pipe(
      map(response => ({
        reviews: response.data || [],
        total: response.total || 0,
        page: response.page || page,
        totalPages: response.total_pages || 0
      })),
      catchError(error => {
        console.error('Error al obtener valoraciones:', error);
        return of({
          reviews: [],
          total: 0,
          page: page,
          totalPages: 0
        });
      })
    );
  }
}
