import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiService } from '../../../../../core/services/api.service';

export interface Question {
  id: string;
  professionalId: string;
  clientName: string;
  question: string;
  answer?: string;
  answeredBy?: string;
  date: string;
  answeredDate?: string;
  helpful: number;
  category: string;
}

export interface QuestionForm {
  email: string;
  name: string;
  message: string;
  user_id: number;
}

export interface QuestionResponse {
  message: string;
  data: {
    email: string;
    name: string;
    message: string;
    user_id: number;
    updated_at: string;
    created_at: string;
    id: number;
  };
}

export interface QaStats {
  totalQuestions: number;
  answeredQuestions: number;
  pendingQuestions: number;
  averageResponseTime: string;
}

@Injectable({
  providedIn: 'root'
})
export class QaService {
  constructor(private apiService: ApiService) {}

  // Obtener preguntas de un profesional
  public getQuestions(professionalId: string, page: number = 1, limit: number = 10): Observable<{ questions: Question[], total: number, page: number, totalPages: number }> {
    return this.apiService.get<{ questions: Question[], total: number, page: number, totalPages: number }>(
      `/api/professionals/${professionalId}/questions?page=${page}&limit=${limit}`
    ).pipe(
      catchError(error => {
        console.warn('Error al obtener preguntas:', error);
        return new Observable(observer => {
          observer.next({
            questions: [],
            total: 0,
            page: 1,
            totalPages: 0
          });
          observer.complete();
        });
      })
    );
  }

  // Enviar nueva pregunta
  public sendQuestion(questionData: QuestionForm): Observable<QuestionResponse> {
    return this.apiService.post<QuestionResponse>('/api/common/questions', questionData).pipe(
      catchError(error => {
        console.error('Error al enviar pregunta:', error);
        return new Observable(observer => {
          observer.next({
            message: 'Error al enviar la pregunta',
            data: {
              email: '',
              name: '',
              message: '',
              user_id: 0,
              updated_at: '',
              created_at: '',
              id: 0
            }
          });
          observer.complete();
        });
      })
    );
  }

  // Obtener estadísticas de Q&A
  public getQaStats(professionalId: string): Observable<QaStats> {
    return this.apiService.get<QaStats>(`/api/professionals/${professionalId}/questions/stats`).pipe(
      catchError(error => {
        console.warn('Error al obtener estadísticas de Q&A:', error);
        return new Observable(observer => {
          observer.next({
            totalQuestions: 0,
            answeredQuestions: 0,
            pendingQuestions: 0,
            averageResponseTime: 'N/A'
          });
          observer.complete();
        });
      })
    );
  }

  // Obtener preguntas recientes
  public getRecentQuestions(professionalId: string, limit: number = 5): Observable<Question[]> {
    return this.apiService.get<Question[]>(`/api/professionals/${professionalId}/questions/recent?limit=${limit}`).pipe(
      catchError(error => {
        console.warn('Error al obtener preguntas recientes:', error);
        return new Observable(observer => {
          observer.next([]);
          observer.complete();
        });
      })
    );
  }

  // Obtener preguntas por categoría
  public getQuestionsByCategory(professionalId: string, category: string): Observable<Question[]> {
    return this.apiService.get<Question[]>(`/api/professionals/${professionalId}/questions?category=${category}`).pipe(
      catchError(error => {
        console.warn('Error al obtener preguntas por categoría:', error);
        return new Observable(observer => {
          observer.next([]);
          observer.complete();
        });
      })
    );
  }

  // Obtener preguntas sin responder
  public getUnansweredQuestions(professionalId: string): Observable<Question[]> {
    return this.apiService.get<Question[]>(`/api/professionals/${professionalId}/questions/unanswered`).pipe(
      catchError(error => {
        console.warn('Error al obtener preguntas sin responder:', error);
        return new Observable(observer => {
          observer.next([]);
          observer.complete();
        });
      })
    );
  }

  // Obtener categorías de preguntas
  public getQuestionCategories(): Observable<string[]> {
    return this.apiService.get<string[]>(`/api/questions/categories`).pipe(
      catchError(error => {
        console.warn('Error al obtener categorías de preguntas:', error);
        return new Observable(observer => {
          observer.next([
            'Servicios',
            'Precios',
            'Disponibilidad',
            'Experiencia',
            'Metodología',
            'Otros'
          ]);
          observer.complete();
        });
      })
    );
  }

  // Marcar pregunta como útil
  public markQuestionAsHelpful(questionId: string): Observable<{ success: boolean }> {
    return this.apiService.post<{ success: boolean }>(`/api/questions/${questionId}/helpful`, {}).pipe(
      catchError(error => {
        console.error('Error al marcar pregunta como útil:', error);
        return new Observable(observer => {
          observer.next({ success: false });
          observer.complete();
        });
      })
    );
  }

  // Obtener preguntas más útiles
  public getMostHelpfulQuestions(professionalId: string, limit: number = 5): Observable<Question[]> {
    return this.apiService.get<Question[]>(`/api/professionals/${professionalId}/questions/most-helpful?limit=${limit}`).pipe(
      catchError(error => {
        console.warn('Error al obtener preguntas más útiles:', error);
        return new Observable(observer => {
          observer.next([]);
          observer.complete();
        });
      })
    );
  }

  // Buscar preguntas
  public searchQuestions(professionalId: string, query: string): Observable<Question[]> {
    return this.apiService.get<Question[]>(`/api/professionals/${professionalId}/questions/search?q=${encodeURIComponent(query)}`).pipe(
      catchError(error => {
        console.warn('Error al buscar preguntas:', error);
        return new Observable(observer => {
          observer.next([]);
          observer.complete();
        });
      })
    );
  }
}
