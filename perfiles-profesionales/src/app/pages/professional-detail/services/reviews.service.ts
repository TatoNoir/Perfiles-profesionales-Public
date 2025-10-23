import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiService } from '../../../services/api.service';

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
}
