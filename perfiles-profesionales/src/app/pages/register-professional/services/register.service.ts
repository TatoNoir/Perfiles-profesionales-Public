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

export interface ZipCode {
  id: number;
  name: string;
  code: string;
  locality_id: number;
}

export interface GeoLocality {
  id: number;
  name: string;
  short_code: string;
  state_id: number;
  zip_codes: ZipCode[];
}

export interface PersonalData {
  firstName: string;
  lastName: string;
  email: string;
  areaCode: string;
  phone: string;
  password: string;
  confirmPassword: string;
  activities: string[]; // Array de IDs de actividades
  description: string;
}

export interface LocationData {
  street: string;
  streetNumber: string;
  floor?: string;
  apartment?: string;
  locality_id: number;
  state_id: number;
  zip_code_id: number;
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

    // Agregar datos personales según el endpoint
    formData.append('first_name', data.firstName);
    formData.append('last_name', data.lastName);
    formData.append('email', data.email);
    formData.append('country_phone', '+54'); // Fijo para Argentina
    formData.append('area_code', data.areaCode);
    formData.append('phone_number', data.phone);
    formData.append('password', data.password);
    formData.append('description', data.description);

    // Agregar datos de ubicación
    formData.append('address', `${data.street} ${data.streetNumber}`); // Dirección completa
    formData.append('street', data.street);
    formData.append('street_number', data.streetNumber);

    // Campos opcionales
    if (data.floor) {
      formData.append('floor', data.floor);
    }
    if (data.apartment) {
      formData.append('apartment', data.apartment);
    }

    formData.append('locality_id', data.locality_id.toString());
    formData.append('user_type_id', '2'); // Fijo para profesionales
    formData.append('zone', data.workZone);

    // Agregar actividades como array
    data.activities.forEach((activityId, index) => {
      formData.append(`activities[${index}]`, activityId);
    });

    // Agregar foto si existe
    if (data.profilePhoto) {
      formData.append('photo', data.profilePhoto);
    }

    return this.apiService.post('/api/register', formData);
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
          {
            id: 1,
            name: 'La Plata',
            short_code: 'la-plata',
            state_id: stateId,
            zip_codes: [
              { id: 1, name: '1900', code: 'B1900', locality_id: 1 }
            ]
          },
          {
            id: 2,
            name: 'Capital Federal',
            short_code: 'capital-federal',
            state_id: stateId,
            zip_codes: [
              { id: 2, name: '1000', code: 'C1000', locality_id: 2 }
            ]
          }
        ];
      }),
      catchError(() => of([
        {
          id: 1,
          name: 'La Plata',
          short_code: 'la-plata',
          state_id: stateId,
          zip_codes: [
            { id: 1, name: '1900', code: 'B1900', locality_id: 1 }
          ]
        },
        {
          id: 2,
          name: 'Capital Federal',
          short_code: 'capital-federal',
          state_id: stateId,
          zip_codes: [
            { id: 2, name: '1000', code: 'C1000', locality_id: 2 }
          ]
        }
      ]))
    );
  }

  // Validar email
  validateEmail(email: string): Observable<{ valid: boolean; message?: string }> {
    return this.apiService.post<{ valid: boolean; message?: string }>(`${this.apiUrl}/professionals/validate-email`, { email });
  }

}
