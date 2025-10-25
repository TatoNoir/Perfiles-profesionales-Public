import { Injectable } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { SharedDataService, ApiActivity, GeoState, GeoLocality, ZipCode } from '../../../services/shared-data.service';
import { Observable } from 'rxjs';

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

  constructor(
    private apiService: ApiService,
    private sharedDataService: SharedDataService
  ) {}

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
    return this.sharedDataService.getActivities();
  }

  // Obtener provincias por país
  getProvincesByCountry(countryId: number = 13): Observable<GeoState[]> {
    return this.sharedDataService.getProvincesByCountry(countryId);
  }

  // Obtener ciudades por provincia
  getLocalitiesByState(stateId: number): Observable<GeoLocality[]> {
    return this.sharedDataService.getLocalitiesByState(stateId);
  }

  // Validar email
  validateEmail(email: string): Observable<{ valid: boolean; message?: string }> {
    return this.apiService.post<{ valid: boolean; message?: string }>(`${this.apiUrl}/professionals/validate-email`, { email });
  }

}
