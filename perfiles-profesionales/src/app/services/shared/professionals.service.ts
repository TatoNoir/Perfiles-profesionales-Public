import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { map, debounceTime, distinctUntilChanged, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { BASIC_PROFESSIONALS_DATA, DETAIL_PROFESSIONALS_DATA } from '../../data/mock-data';

// Interface para datos básicos (usados en listas)
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
}

// Interface para datos detallados (usados en perfil completo)
export interface ProfessionalDetail {
  id: string;
  skills: string[];
  aboutMe: string;
  workZones: string[];
  completedProjects: number;
  responseRate: number;
  responseTime: string;
  contactInfo: {
    email: string;
    whatsapp: string;
    instagram: string;
    facebook: string;
    linkedin: string;
  };
  experience: {
    years: number;
    description: string;
  };
  reviewData: {
    averageRating: number;
    totalReviews: number;
    hasReviews: boolean;
  };
  qa: {
    hasQuestions: boolean;
    totalQuestions: number;
  };
}

// Interface completa (combinación de ambas)
export interface Professional extends ProfessionalBasic, ProfessionalDetail {}

export interface FilterOptions {
  specialty: string;
  location: string;
  searchQuery: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProfessionalService {
  private professionalsSubject = new BehaviorSubject<Professional[]>([]);
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
          prof.skills.some(skill => skill.toLowerCase().includes(search.toLowerCase()));

        return matchesSpecialty && matchesLocation && matchesSearch;
      });
    })
  );

  constructor(private http: HttpClient) {
    // Datos de ejemplo - en una aplicación real vendrían de una API
    this.loadSampleData();
  }

  // Datos básicos para listas
  private getBasicData(): ProfessionalBasic[] {
    return BASIC_PROFESSIONALS_DATA;
  }

  // Datos detallados para perfiles completos
  private getDetailData(): ProfessionalDetail[] {
    return DETAIL_PROFESSIONALS_DATA;
  }

  private loadSampleData() {
    const basicData = this.getBasicData();
    const detailData = this.getDetailData();

    // Combinar datos básicos y detallados
    const sampleData: Professional[] = basicData.map(basic => {
      const detail = detailData.find(d => d.id === basic.id);
      if (!detail) {
        throw new Error(`No se encontraron datos detallados para el profesional ${basic.id}`);
      }
      return { ...basic, ...detail };
    });

    this.professionalsSubject.next(sampleData);
  }

  // Métodos para obtener datos separados
  public getBasicProfessionals(): Observable<ProfessionalBasic[]> {
    // Intentar obtener datos del endpoint real
    return this.http.get<ProfessionalBasic[]>(`${environment.apiUrl}/api/professionals/basic`).pipe(
      catchError(error => {
        console.warn('Error al obtener profesionales del endpoint, usando datos mock:', error);
        // Fallback a datos mock si el endpoint falla
        return this.professionals$.pipe(
          map(professionals =>
            professionals.map(prof => ({
              id: prof.id,
              name: prof.name,
              profession: prof.profession,
              category: prof.category,
              rating: prof.rating,
              reviews: prof.reviews,
              location: prof.location,
              avatar: prof.avatar,
              pricePerHour: prof.pricePerHour,
              isVerified: prof.isVerified,
              status: prof.status,
              description: prof.description
            }))
          )
        );
      })
    );
  }

  public getProfessionalDetail(id: string): Observable<ProfessionalDetail | undefined> {
    // Intentar obtener datos del endpoint real
    return this.http.get<ProfessionalDetail>(`${environment.apiUrl}/api/professionals/${id}/detail`).pipe(
      catchError(error => {
        console.warn('Error al obtener detalles del profesional del endpoint, usando datos mock:', error);
        // Fallback a datos mock si el endpoint falla
        return this.professionals$.pipe(
          map(professionals => {
            const prof = professionals.find(p => p.id === id);
            if (!prof) return undefined;

            return {
              id: prof.id,
              skills: prof.skills,
              aboutMe: prof.aboutMe,
              workZones: prof.workZones,
              completedProjects: prof.completedProjects,
              responseRate: prof.responseRate,
              responseTime: prof.responseTime,
              contactInfo: prof.contactInfo,
              experience: prof.experience,
              reviewData: prof.reviewData,
              qa: prof.qa
            };
          })
        );
      })
    );
  }

  // Métodos existentes
  public getProfessionalById(id: string): Observable<Professional | undefined> {
    return this.professionals$.pipe(
      map(professionals => professionals.find(prof => prof.id === id))
    );
  }

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

  public getStatusText(status: string): string {
    const statusMap: { [key: string]: string } = {
      'available': 'Disponible',
      'busy': 'Ocupado',
      'offline': 'Desconectado'
    };
    return statusMap[status] || status;
  }

  public getStatusColor(status: string): string {
    const colorMap: { [key: string]: string } = {
      'available': '#10b981',
      'busy': '#f59e0b',
      'offline': '#6b7280'
    };
    return colorMap[status] || '#6b7280';
  }
}
