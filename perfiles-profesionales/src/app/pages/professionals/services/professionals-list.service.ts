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
    province?: string;
  avatar?: string;
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

  // Buscar profesionales por actividad
  public searchProfessionalsByActivity(activityTerm: string): Observable<ProfessionalBasic[]> {
    const params = this.apiService.createParams({
      activity: activityTerm
    });

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

  // Métodos específicos para filtros
  public setLocationFilter(location: string): void {
    this.locationFilter.next(location);
  }
}
