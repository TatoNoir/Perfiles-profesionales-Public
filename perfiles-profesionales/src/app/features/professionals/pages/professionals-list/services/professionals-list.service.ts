import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest, of } from 'rxjs';
import { map, debounceTime, distinctUntilChanged, catchError } from 'rxjs/operators';
import { ApiService } from '../../../../../core/services/api.service';
import { DataMapperService } from '../../../../../shared/services/data-mapper.service';
import { ApiProfessionalsResponse } from '../../../../../shared/interfaces/api-response.interface';

export interface ProfessionalBasic {
  id: string;
  name: string;
  profession: string;
  category: string;
  rating: number;
  reviews: number;
    location: string;
    province?: string;
    profile_picture?: string;
  pricePerHour: number;
  isVerified: boolean;
  status: 'available' | 'busy' | 'offline';
  description: string;
  skills: string[];
}

@Injectable({
  providedIn: 'root'
})
export class ProfessionalsListService {
  private professionalsSubject = new BehaviorSubject<ProfessionalBasic[]>([]);
  public professionals$ = this.professionalsSubject.asObservable();

  // Filtros reactivos
  private specialtyFilter = new BehaviorSubject<string>('all');
  private locationFilter = new BehaviorSubject<string>('all');
  private searchQuery = new BehaviorSubject<string>('');

  // Observables para filtros
  public specialtyFilter$ = this.specialtyFilter.asObservable();
  public locationFilter$ = this.locationFilter.asObservable();
  public searchQuery$ = this.searchQuery.asObservable();

  // Profesionales filtrados
  public filteredProfessionals$ = combineLatest([
    this.professionals$,
    this.specialtyFilter$,
    this.locationFilter$,
    this.searchQuery$.pipe(debounceTime(300), distinctUntilChanged())
  ]).pipe(
    map(([professionals, specialty, location, search]) => {
      return professionals.filter(prof => {
        const matchesSpecialty = specialty === 'all' || prof.category === specialty;
        const matchesLocation = location === 'all' || prof.location.toLowerCase().includes(location.toLowerCase());
        const matchesSearch = !search ||
          prof.name.toLowerCase().includes(search.toLowerCase()) ||
          prof.profession.toLowerCase().includes(search.toLowerCase()) ||
          prof.description.toLowerCase().includes(search.toLowerCase());

        return matchesSpecialty && matchesLocation && matchesSearch;
      });
    })
  );

  constructor(
    private apiService: ApiService,
    private dataMapper: DataMapperService
  ) {
    // Comentado temporalmente para usar solo datos del API
    // this.loadSampleData();
  }

  private loadSampleData() {
    // Ya no cargamos datos de muestra, solo datos del API
  }

  // Buscar profesionales por actividad (opcional) y/o ubicación
  public searchProfessionalsByActivity(activityId?: number | null, stateId?: number, localityId?: number): Observable<ProfessionalBasic[]> {
    let params = this.apiService.createParams({
      page: '1',
      limit: '6'
    });

    // Agregar activity_id solo si está presente y no es null
    if (activityId !== null && activityId !== undefined) {
      params = params.set('activity_id', activityId.toString());
    }

    // Agregar state_id si está presente
    if (stateId) {
      params = params.set('state_id', stateId.toString());
    }

    // Agregar locality_id si está presente
    if (localityId) {
      params = params.set('locality_id', localityId.toString());
    }

    return this.apiService.get<ApiProfessionalsResponse>('/api/professionals', params).pipe(
      map(apiResponse => {
        const professionals = this.dataMapper.mapApiResponseToProfessionals(apiResponse);
        // Actualizar el BehaviorSubject con los datos filtrados
        this.professionalsSubject.next(professionals);
        return professionals;
      }),
      catchError(error => {
        console.error('❌ Error al buscar profesionales por actividad:', error);
        return of([]);
      })
    );
  }

  // Buscar profesionales con parámetros de búsqueda (search, activity_id, state_id, locality_id)
  public searchProfessionals(search?: string, activityId?: number | null, stateId?: number, localityId?: number): Observable<ProfessionalBasic[]> {
    let params = this.apiService.createParams({
      page: '1',
      limit: '6'
    });

    // Agregar search si está presente
    if (search && search.trim()) {
      params = params.set('search', search.trim());
    }

    // Agregar activity_id solo si está presente y no es null
    if (activityId !== null && activityId !== undefined) {
      params = params.set('activity_id', activityId.toString());
    }

    // Agregar state_id si está presente
    if (stateId) {
      params = params.set('state_id', stateId.toString());
    }

    // Agregar locality_id si está presente
    if (localityId) {
      params = params.set('locality_id', localityId.toString());
    }

    return this.apiService.get<ApiProfessionalsResponse>('/api/professionals', params).pipe(
      map(apiResponse => {
        const professionals = this.dataMapper.mapApiResponseToProfessionals(apiResponse);
        // Actualizar el BehaviorSubject con los datos filtrados
        this.professionalsSubject.next(professionals);
        return professionals;
      }),
      catchError(error => {
        console.error('❌ Error al buscar profesionales:', error);
        return of([]);
      })
    );
  }

  // Obtener lista de profesionales
  public getProfessionals(stateId?: number, localityId?: number): Observable<ProfessionalBasic[]> {
    let params = this.apiService.createParams({
      page: '1',
      limit: '100' // Un límite razonable, puedes ajustarlo
    });

    // Agregar state_id si está presente
    if (stateId) {
      params = params.set('state_id', stateId.toString());
    }

    // Agregar locality_id si está presente
    if (localityId) {
      params = params.set('locality_id', localityId.toString());
    }

    return this.apiService.get<ApiProfessionalsResponse>('/api/professionals', params).pipe(
      map(apiResponse => {
        const professionals = this.dataMapper.mapApiResponseToProfessionals(apiResponse);

        // Actualizar el BehaviorSubject con los datos reales
        this.professionalsSubject.next(professionals);
        return professionals;
      }),
      catchError(error => {
        console.warn('Error al obtener profesionales del API:', error);
        return of([]);
      })
    );
  }

  public getProfessionalsForHome(): Observable<ProfessionalBasic[]> {
    const params = this.apiService.createParams({
      limit: '9',
      page: '1'
    });

    return this.apiService.get<ApiProfessionalsResponse>('/api/professionals', params).pipe(
      map(apiResponse => {
        const professionals = this.dataMapper.mapApiResponseToProfessionals(apiResponse);
        this.professionalsSubject.next(professionals);
        return professionals;
      }),
      catchError(error => {
        console.warn('Error al obtener profesionales para la home:', error);
        return of([]);
      })
    );
  }

  // Métodos específicos para filtros
  public setLocationFilter(location: string): void {
    this.locationFilter.next(location);
  }
}
