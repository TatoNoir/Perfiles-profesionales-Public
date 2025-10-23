import { Injectable } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export interface ApiActivity {
  id: string;
  name: string;
  description?: string;
  category?: string;
}

export interface GeoState {
  id: number;
  name: string;
}

export interface GeoLocality {
  id: number;
  name: string;
}

export interface PersonalData {
  firstName: string;
  lastName: string;
  email: string;
  areaCode: string;
  phone: string;
  activities: string[]; // Array de IDs de actividades
  description: string;
}

export interface LocationData {
  address: string;
  locality_id: number;
  state_id: number;
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

  constructor(private apiService: ApiService,) {}

  // Enviar datos personales
  submitPersonalData(data: PersonalData): Observable<any> {
    return this.apiService.post(`${this.apiUrl}/professionals/personal-data`, data);
  }

  // Enviar datos de ubicación
  submitLocationData(data: LocationData): Observable<any> {
    return this.apiService.post(`${this.apiUrl}/professionals/location-data`, data);
  }

  // Subir foto de perfil
  uploadProfilePhoto(photo: File): Observable<any> {
    const formData = new FormData();
    formData.append('profilePhoto', photo);
    return this.apiService.post(`${this.apiUrl}/professionals/profile-photo`, formData);
  }

  // Enviar registro completo
  submitCompleteRegistration(data: ProfessionalRegistration): Observable<any> {
    const formData = new FormData();

    // Agregar datos personales
    formData.append('firstName', data.firstName);
    formData.append('lastName', data.lastName);
    formData.append('email', data.email);
    formData.append('areaCode', data.areaCode);
    formData.append('phone', data.phone);
    formData.append('activities', JSON.stringify(data.activities));
    formData.append('description', data.description);

    // Agregar datos de ubicación
    formData.append('address', data.address);
    formData.append('locality_id', data.locality_id.toString());
    formData.append('state_id', data.state_id.toString());
    formData.append('workZone', data.workZone);

    // Agregar foto si existe
    if (data.profilePhoto) {
      formData.append('profilePhoto', data.profilePhoto);
    }

    return this.apiService.post(`${this.apiUrl}/professionals/register`, formData);
  }

  // Obtener actividades disponibles
  getActivities(): Observable<ApiActivity[]> {
    return this.apiService.get<{ data: ApiActivity[] }>(`/api/common/activities`).pipe(
      map(response => response.data),
      catchError(error => {
        console.error('Error fetching activities from API:', error);
        // Fallback: retornar array vacío en caso de error
        return of([]);
      })
    );
  }

  // Obtener provincias por país
  getProvincesByCountry(countryId: number = 13): Observable<GeoState[]> {
    return this.apiService.get<{ data: GeoState[] } | GeoState[]>(`/api/states?country_id=${encodeURIComponent(countryId)}`).pipe(
      map((response: any) => {
        if (response?.data && Array.isArray(response.data)) return response.data as GeoState[];
        if (Array.isArray(response)) return response as GeoState[];
        return [
          { id: 1, name: 'Buenos Aires' },
          { id: 2, name: 'Córdoba' },
          { id: 3, name: 'Santa Fe' },
          { id: 4, name: 'Mendoza' },
          { id: 5, name: 'Tucumán' }
        ];
      }),
      catchError(() => of([
        { id: 1, name: 'Buenos Aires' },
        { id: 2, name: 'Córdoba' },
        { id: 3, name: 'Santa Fe' },
        { id: 4, name: 'Mendoza' },
        { id: 5, name: 'Tucumán' }
      ]))
    );
  }

  // Obtener ciudades por provincia
  getLocalitiesByState(stateId: number): Observable<GeoLocality[]> {
    return this.apiService.get<{ data: GeoLocality[] } | GeoLocality[]>(`/api/localities?state_id=${encodeURIComponent(stateId)}`).pipe(
      map((response: any) => {
        if (response?.data && Array.isArray(response.data)) return response.data as GeoLocality[];
        if (Array.isArray(response)) return response as GeoLocality[];
        return [
          { id: 1, name: 'La Plata' },
          { id: 2, name: 'Capital Federal' },
          { id: 3, name: 'Mar del Plata' },
          { id: 4, name: 'Bahía Blanca' }
        ];
      }),
      catchError(() => of([
        { id: 1, name: 'La Plata' },
        { id: 2, name: 'Capital Federal' },
        { id: 3, name: 'Mar del Plata' },
        { id: 4, name: 'Bahía Blanca' }
      ]))
    );
  }

  // Validar email
  validateEmail(email: string): Observable<{ valid: boolean; message?: string }> {
    return this.apiService.post<{ valid: boolean; message?: string }>(`${this.apiUrl}/professionals/validate-email`, { email });
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
