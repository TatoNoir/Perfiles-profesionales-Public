import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiService } from '../../../services/api.service';

export interface ContactRequest {
  professionalId: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  contactMethod: 'email' | 'whatsapp' | 'phone';
}

export interface ContactResponse {
  success: boolean;
  message: string;
  contactId?: string;
}

export interface ContactInfo {
  email: string;
  whatsapp: string;
  instagram: string;
  facebook: string;
  linkedin: string;
}

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  constructor(private apiService: ApiService) {}

  // Enviar solicitud de contacto
  public sendContactRequest(request: ContactRequest): Observable<ContactResponse> {
    return this.apiService.post<ContactResponse>(`/api/contact`, request).pipe(
      catchError(error => {
        console.error('Error al enviar solicitud de contacto:', error);
        return new Observable(observer => {
          observer.next({
            success: false,
            message: 'Error al enviar la solicitud de contacto'
          });
          observer.complete();
        });
      })
    );
  }

  // Obtener información de contacto del profesional
  public getContactInfo(professionalId: string): Observable<ContactInfo> {
    return this.apiService.get<ContactInfo>(`/api/professionals/${professionalId}/contact`).pipe(
      catchError(error => {
        console.warn('Error al obtener información de contacto:', error);
        return new Observable(observer => {
          observer.next({
            email: '',
            whatsapp: '',
            instagram: '',
            facebook: '',
            linkedin: ''
          });
          observer.complete();
        });
      })
    );
  }

  // Enviar mensaje por WhatsApp
  public sendWhatsAppMessage(phone: string, message: string): Observable<{ success: boolean }> {
    return this.apiService.post<{ success: boolean }>(`/api/contact/whatsapp`, {
      phone,
      message
    }).pipe(
      catchError(error => {
        console.error('Error al enviar mensaje por WhatsApp:', error);
        return new Observable(observer => {
          observer.next({ success: false });
          observer.complete();
        });
      })
    );
  }

  // Enviar email
  public sendEmail(to: string, subject: string, message: string): Observable<{ success: boolean }> {
    return this.apiService.post<{ success: boolean }>(`/api/contact/email`, {
      to,
      subject,
      message
    }).pipe(
      catchError(error => {
        console.error('Error al enviar email:', error);
        return new Observable(observer => {
          observer.next({ success: false });
          observer.complete();
        });
      })
    );
  }

  // Obtener historial de contactos
  public getContactHistory(professionalId: string): Observable<any[]> {
    return this.apiService.get<any[]>(`/api/contact/history/${professionalId}`).pipe(
      catchError(error => {
        console.warn('Error al obtener historial de contactos:', error);
        return new Observable(observer => {
          observer.next([]);
          observer.complete();
        });
      })
    );
  }

  // Marcar mensaje como leído
  public markAsRead(contactId: string): Observable<{ success: boolean }> {
    return this.apiService.put<{ success: boolean }>(`/api/contact/${contactId}/read`, {}).pipe(
      catchError(error => {
        console.error('Error al marcar mensaje como leído:', error);
        return new Observable(observer => {
          observer.next({ success: false });
          observer.complete();
        });
      })
    );
  }

  // Obtener plantillas de mensaje
  public getMessageTemplates(): Observable<string[]> {
    return this.apiService.get<string[]>(`/api/contact/templates`).pipe(
      catchError(error => {
        console.warn('Error al obtener plantillas de mensaje:', error);
        return new Observable(observer => {
          observer.next([
            'Hola, me interesa contratar tus servicios...',
            'Buenos días, quisiera más información sobre...',
            'Hola, ¿podrías ayudarme con...'
          ]);
          observer.complete();
        });
      })
    );
  }
}
