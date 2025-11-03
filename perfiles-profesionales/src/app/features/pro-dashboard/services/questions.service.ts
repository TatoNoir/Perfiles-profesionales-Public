import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../../core/auth/services/auth.service';

export interface QuestionUser {
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

export interface Question {
  id: number;
  name: string;
  email: string;
  question: string;
  answer: string | null;
  published: boolean;
  user_id: number;
  created_at: string;
  updated_at: string;
  user: QuestionUser;
}

export interface QuestionsResponse {
  data: Question[];
}

export interface AnswerQuestionRequest {
  answer: string;
}

@Injectable({
  providedIn: 'root'
})
export class QuestionsService {
  private readonly endpoint = '/api/professionals/get/questions';

  constructor(
    private apiService: ApiService,
    private authService: AuthService
  ) {}

  /**
   * Obtiene la lista de preguntas con un límite específico
   * @param limit Número de preguntas a obtener (5 para overview, 20 para la sección completa)
   * @returns Observable con la lista de preguntas
   */
  getQuestions(limit: number = 20): Observable<Question[]> {
    const token = this.authService.getToken();
    if (!token) {
      throw new Error('No hay token de autenticación disponible');
    }

    const params = this.apiService.createParams({ limit: limit.toString() });

    return this.apiService.getWithAuth<QuestionsResponse>(
      this.endpoint,
      token,
      params
    ).pipe(
      map((response: QuestionsResponse) => response.data || []),
      catchError(error => {
        console.error('Error al obtener preguntas:', error);
        throw error;
      })
    );
  }

  /**
   * Obtiene las últimas preguntas para el overview (límite de 5)
   * @returns Observable con las últimas 5 preguntas
   */
  getOverviewQuestions(): Observable<Question[]> {
    return this.getQuestions(5);
  }

  /**
   * Obtiene todas las preguntas para la sección completa (límite de 20)
   * @returns Observable con las preguntas
   */
  getAllQuestions(): Observable<Question[]> {
    return this.getQuestions(20);
  }

  /**
   * Responde a una pregunta
   * @param questionId ID de la pregunta
   * @param answer Texto de la respuesta
   * @returns Observable con la pregunta actualizada
   */
  answerQuestion(questionId: number, answer: string): Observable<Question> {
    const token = this.authService.getToken();
    if (!token) {
      throw new Error('No hay token de autenticación disponible');
    }

    const body: AnswerQuestionRequest = { answer };
    const endpoint = `/api/professionals/respond/question/${questionId}`;

    return this.apiService.putWithAuth<QuestionsResponse>(
      endpoint,
      body,
      token
    ).pipe(
      map((response: any) => {
        // La respuesta puede venir como { data: Question } o directamente como Question
        return response.data || response;
      }),
      catchError(error => {
        console.error('Error al responder la pregunta:', error);
        throw error;
      })
    );
  }

  /**
   * Modifica la respuesta de una pregunta existente
   * @param questionId ID de la pregunta
   * @param answer Nuevo texto de la respuesta
   * @returns Observable con la pregunta actualizada
   */
  updateQuestionAnswer(questionId: number, answer: string): Observable<Question> {
    const token = this.authService.getToken();
    if (!token) {
      throw new Error('No hay token de autenticación disponible');
    }

    const body: AnswerQuestionRequest = { answer };
    const endpoint = `/api/professionals/respond/question/${questionId}`;

    return this.apiService.putWithAuth<QuestionsResponse>(
      endpoint,
      body,
      token
    ).pipe(
      map((response: any) => {
        // La respuesta puede venir como { data: Question } o directamente como Question
        return response.data || response;
      }),
      catchError(error => {
        console.error('Error al actualizar la respuesta:', error);
        throw error;
      })
    );
  }
}

