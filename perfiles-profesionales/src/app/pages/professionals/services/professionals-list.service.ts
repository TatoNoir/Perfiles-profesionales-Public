import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { map, debounceTime, distinctUntilChanged, catchError } from 'rxjs/operators';
import { ApiService } from '../../../services/api.service';
import { BASIC_PROFESSIONALS_DATA } from '../../../data/mock-data';

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

  constructor(private apiService: ApiService) {
    this.loadSampleData();
  }

  private loadSampleData() {
    this.professionalsSubject.next(BASIC_PROFESSIONALS_DATA);
  }

  // Obtener lista de profesionales
  public getProfessionals(): Observable<ProfessionalBasic[]> {
    return this.apiService.get<ProfessionalBasic[]>('/api/professionals').pipe(
      catchError(error => {
        console.warn('Error al obtener profesionales del endpoint, usando datos mock:', error);
        return this.professionals$;
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
