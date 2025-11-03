import { Injectable } from '@angular/core';
import { ApiService } from '../../core/services/api.service';
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

@Injectable({
  providedIn: 'root'
})
export class SharedDataService {

  constructor(private apiService: ApiService) {}

  // Obtener actividades disponibles
  getActivities(): Observable<ApiActivity[]> {
    return this.apiService.get<{ data: ApiActivity[] }>(`/api/common/activities`).pipe(
      map(response => response.data),
      catchError(error => {
        console.error('Error fetching activities from API:', error);
        // Fallback: retornar array vacío en caso de error
        return of([
          { id: '1', name: 'Desarrollo Web', description: 'Desarrollo de sitios web y aplicaciones web' },
          { id: '2', name: 'Desarrollo Mobile', description: 'Desarrollo de aplicaciones móviles' },
          { id: '3', name: 'Diseño UX/UI', description: 'Diseño de experiencia de usuario e interfaz' },
          { id: '4', name: 'Marketing Digital', description: 'Estrategias de marketing digital' },
          { id: '5', name: 'Consultoría IT', description: 'Consultoría en tecnología' }
        ]);
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
}
