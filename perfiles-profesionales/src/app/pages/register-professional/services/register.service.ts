import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface PersonalData {
  firstName: string;
  lastName: string;
  email: string;
  areaCode: string;
  phone: string;
  specialty: string;
  description: string;
}

export interface LocationData {
  address: string;
  city: string;
  province: string;
  workZone: string;
}

export interface ProfilePhoto {
  profilePhoto: File | null;
}

export interface ProfessionalRegistration extends PersonalData, LocationData, ProfilePhoto {
  id?: string;
  createdAt?: Date;
  status?: 'pending' | 'approved' | 'rejected';
}

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  private apiUrl = 'https://api.perfilesprofesionales.com'; // Cambiar por la URL real

  constructor(private http: HttpClient) {}

  // Enviar datos personales
  submitPersonalData(data: PersonalData): Observable<any> {
    return this.http.post(`${this.apiUrl}/professionals/personal-data`, data);
  }

  // Enviar datos de ubicación
  submitLocationData(data: LocationData): Observable<any> {
    return this.http.post(`${this.apiUrl}/professionals/location-data`, data);
  }

  // Subir foto de perfil
  uploadProfilePhoto(photo: File): Observable<any> {
    const formData = new FormData();
    formData.append('profilePhoto', photo);
    return this.http.post(`${this.apiUrl}/professionals/profile-photo`, formData);
  }

  // Enviar registro completo
  submitCompleteRegistration(data: ProfessionalRegistration): Observable<any> {
    const formData = new FormData();

    // Agregar datos personales
    formData.append('firstName', data.firstName);
    formData.append('lastName', data.lastName);
    formData.append('email', data.email);
    formData.append('phone', data.phone);
    formData.append('specialty', data.specialty);
    formData.append('description', data.description);

    // Agregar datos de ubicación
    formData.append('address', data.address);
    formData.append('city', data.city);
    formData.append('province', data.province);
    formData.append('workZone', data.workZone);

    // Agregar foto si existe
    if (data.profilePhoto) {
      formData.append('profilePhoto', data.profilePhoto);
    }

    return this.http.post(`${this.apiUrl}/professionals/register`, formData);
  }

  // Obtener especialidades disponibles
  getSpecialties(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/specialties`);
  }

  // Obtener provincias disponibles
  getProvinces(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/provinces`);
  }

  // Validar email
  validateEmail(email: string): Observable<{ valid: boolean; message?: string }> {
    return this.http.post<{ valid: boolean; message?: string }>(`${this.apiUrl}/professionals/validate-email`, { email });
  }

  // Simular envío (para desarrollo)
  simulateRegistration(data: ProfessionalRegistration): Observable<any> {
    return new Observable(observer => {
      setTimeout(() => {
        observer.next({
          success: true,
          message: 'Registro enviado exitosamente',
          data: {
            id: 'temp_' + Date.now(),
            ...data,
            createdAt: new Date(),
            status: 'pending'
          }
        });
        observer.complete();
      }, 2000);
    });
  }
}
