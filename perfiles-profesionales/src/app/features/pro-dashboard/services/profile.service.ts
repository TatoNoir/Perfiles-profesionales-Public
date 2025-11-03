import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../../core/auth/services/auth.service';

export interface UserType {
  id: number;
  name: string;
  description: string;
  disabled: number;
  created_at: string | null;
  updated_at: string | null;
}

export interface Activity {
  id: number;
  name: string;
  short_code: string;
  tags: string;
  code: string;
  disabled: number;
  created_at: string | null;
  updated_at: string | null;
  pivot: {
    user_id: number;
    activity_id: number;
  };
}

export interface State {
  id: number;
  country_id: number;
  name: string;
  codigo3166_2: string;
  deleted_at: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface Locality {
  id: number;
  name: string;
  short_code: string;
  state_id: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  state: State;
}

export interface ProfessionalProfile {
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
  user_type: UserType;
  activities: Activity[];
  locality: Locality;
}

export interface ProfessionalProfileResponse {
  data: ProfessionalProfile;
}

export interface UpdateProfileRequest {
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
  description: string;
  address: string;
  street: string;
  street_number: string;
  floor: string;
  apartment: string;
  locality_id: number;
  activities: number[];
}

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private readonly endpoint = '/api/professionals/get/detail';
  private readonly updateEndpoint = '/api/professionals/update_profile';
  private readonly updatePhotoEndpoint = '/api/professionals/update_profile_picture';

  constructor(
    private apiService: ApiService,
    private authService: AuthService
  ) {}

  /**
   * Obtiene los detalles completos del perfil del profesional
   * @returns Observable con los datos del perfil profesional
   */
  getProfile(): Observable<ProfessionalProfile> {
    const token = this.authService.getToken();
    if (!token) {
      throw new Error('No hay token de autenticación disponible');
    }

    return this.apiService.getWithAuth<ProfessionalProfileResponse>(
      this.endpoint,
      token
    ).pipe(
      map((response: ProfessionalProfileResponse) => response.data),
      catchError(error => {
        console.error('Error al obtener el perfil:', error);
        throw error;
      })
    );
  }

  /**
   * Actualiza el perfil del profesional
   * @param profileData Datos del perfil a actualizar
   * @returns Observable con la respuesta de la actualización
   */
  updateProfile(profileData: UpdateProfileRequest): Observable<ProfessionalProfile> {
    const token = this.authService.getToken();
    if (!token) {
      throw new Error('No hay token de autenticación disponible');
    }

    return this.apiService.putWithAuth<ProfessionalProfileResponse>(
      this.updateEndpoint,
      profileData,
      token
    ).pipe(
      map((response: any) => {
        // La respuesta puede venir como { data: ProfessionalProfile } o directamente como ProfessionalProfile
        return response.data || response;
      }),
      catchError(error => {
        console.error('Error al actualizar el perfil:', error);
        throw error;
      })
    );
  }

  /**
   * Actualiza la foto de perfil del profesional
   * @param file Archivo de imagen
   * @returns Observable con { message, photo_url }
   */
  updateProfilePicture(file: File): Observable<{ message: string; photo_url: string }> {
    const token = this.authService.getToken();
    if (!token) {
      throw new Error('No hay token de autenticación disponible');
    }

    const formData = new FormData();
    // El backend espera el campo 'photo'
    formData.append('photo', file);

    return this.apiService.postWithAuth<{ message: string; photo_url: string }>(
      this.updatePhotoEndpoint,
      formData,
      token
    ).pipe(
      map((response: any) => response),
      catchError(error => {
        console.error('Error al actualizar la foto de perfil:', error);
        throw error;
      })
    );
  }
}

