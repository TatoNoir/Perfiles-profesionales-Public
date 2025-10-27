import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest, of } from 'rxjs';
import { map, debounceTime, distinctUntilChanged, catchError } from 'rxjs/operators';
import { ApiService } from '../../../services/api.service';
import { DataMapperService } from '../../../services/data-mapper.service';
import { ApiProfessionalsResponse } from '../../../interfaces/api-response.interface';

export interface ProfessionalBasic {
  id: string;
  name: string;
  profession: string;
  category: string;
  rating: number;
  reviews: number;
  location: string;
  avatar?: string;
  pricePerHour: number;
  isVerified: boolean;
  status: 'available' | 'busy' | 'offline';
  description: string;
  skills: string[];
}

export interface FilterOptions {
  specialty: string;
  location: string;
  searchQuery: string;
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

  // Buscar profesionales por actividad
  public searchProfessionalsByActivity(activityTerm: string): Observable<ProfessionalBasic[]> {
    const params = this.apiService.createParams({
      activity: activityTerm
    });

    console.log('🔍 Buscando profesionales por actividad:', activityTerm);
    console.log('📤 Parámetros enviados:', params);
    console.log('🌐 URL completa:', `/api/professionals?activity=${activityTerm}`);

    return this.apiService.get<ApiProfessionalsResponse>('/api/professionals', params).pipe(
      map(apiResponse => {
        console.log('✅ Respuesta del API para búsqueda por actividad:', apiResponse);
        const professionals = this.dataMapper.mapApiResponseToProfessionals(apiResponse);
        console.log('👥 Profesionales encontrados:', professionals);
        // Actualizar el BehaviorSubject con los datos filtrados
        this.professionalsSubject.next(professionals);
        return professionals;
      }),
      catchError(error => {
        console.error('❌ Error al buscar profesionales por actividad:', error);
        console.error('🔍 Detalles del error:', error.message);
        return of([]);
      })
    );
  }

  // Obtener lista de profesionales
  public getProfessionals(): Observable<ProfessionalBasic[]> {
    return this.apiService.get<ApiProfessionalsResponse>('/api/professionals').pipe(
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

  // Obtener profesionales con filtros
  public getProfessionalsWithFilters(filters: FilterOptions): Observable<ProfessionalBasic[]> {
    const params = this.apiService.createParams({
      category: filters.specialty !== 'all' ? filters.specialty : undefined,
      location: filters.location !== 'all' ? filters.location : undefined,
      search: filters.searchQuery || undefined
    });

    return this.apiService.get<ProfessionalBasic[]>('/api/professionals', params).pipe(
      catchError(error => {
        console.warn('Error al obtener profesionales filtrados, usando datos mock:', error);
        return this.filteredProfessionals$;
      })
    );
  }

  // Actualizar filtros
  public updateFilters(filters: Partial<FilterOptions>): void {
    if (filters.specialty !== undefined) {
      this.specialtyFilter.next(filters.specialty);
    }
    if (filters.location !== undefined) {
      this.locationFilter.next(filters.location);
    }
    if (filters.searchQuery !== undefined) {
      this.searchQuery.next(filters.searchQuery);
    }
  }

  // Métodos específicos para filtros
  public setSpecialtyFilter(specialty: string): void {
    this.specialtyFilter.next(specialty);
  }

  public setLocationFilter(location: string): void {
    this.locationFilter.next(location);
  }

  public setSearchQuery(query: string): void {
    this.searchQuery.next(query);
  }

  // Obtener categorías disponibles
  public getCategories(): Observable<string[]> {
    return this.apiService.get<string[]>('/api/categories').pipe(
      catchError(error => {
        console.warn('Error al obtener categorías, usando datos mock:', error);
        return new Observable(observer => {
          observer.next(['tecnologia', 'diseno', 'marketing', 'finanzas', 'salud', 'legal']);
          observer.complete();
        });
      })
    );
  }

  // Obtener ubicaciones disponibles
  public getLocations(): Observable<string[]> {
    return this.apiService.get<string[]>('/api/locations').pipe(
      catchError(error => {
        console.warn('Error al obtener ubicaciones, usando datos mock:', error);
        return new Observable(observer => {
          observer.next(['Madrid', 'Barcelona', 'Valencia', 'Sevilla', 'Bilbao', 'Málaga']);
          observer.complete();
        });
      })
    );
  }

  // Limpiar filtros
  public clearFilters(): void {
    this.specialtyFilter.next('all');
    this.locationFilter.next('all');
    this.searchQuery.next('');
  }

  // Obtener estado actual de filtros
  public getCurrentFilters(): FilterOptions {
    return {
      specialty: this.specialtyFilter.value,
      location: this.locationFilter.value,
      searchQuery: this.searchQuery.value
    };
  }
}
