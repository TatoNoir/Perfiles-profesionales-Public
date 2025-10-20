import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { map, debounceTime, distinctUntilChanged } from 'rxjs/operators';

export interface Professional {
  id: string;
  name: string;
  profession: string;
  category: string;
  rating: number;
  reviews: number;
  location: string;
  avatar?: string;
  skills: string[];
  description: string;
  pricePerHour: number;
  isVerified: boolean;
  status: 'available' | 'busy' | 'offline';
  completedProjects: number;
  responseRate: number;
  responseTime: string;
  workZones: string[];
  aboutMe: string;
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

  constructor() {
    // Datos de ejemplo - en una aplicación real vendrían de una API
    this.loadSampleData();
  }

  private loadSampleData() {
    const sampleData: Professional[] = [
      {
        id: '1',
        name: 'María González',
        profession: 'Desarrolladora Full Stack',
        category: 'tecnologia',
        rating: 4.9,
        reviews: 127,
        location: 'Madrid, España',
        skills: ['React', 'Node.js', 'TypeScript', 'MongoDB', 'AWS'],
        description: 'Desarrolladora Full Stack con más de 8 años de experiencia en aplicaciones web modernas.',
        pricePerHour: 85,
        isVerified: true,
        status: 'available',
        completedProjects: 89,
        responseRate: 95,
        responseTime: '1 hora',
        workZones: ['Madrid', 'Comunidad de Madrid', 'Toledo', 'Guadalajara'],
        aboutMe: 'Desarrolladora full stack apasionada por crear soluciones tecnológicas innovadoras. Especializada en React, Node.js y arquitecturas cloud. Con más de 5 años de experiencia ayudando a empresas a digitalizar sus procesos.',
        contactInfo: {
          email: 'maria.gonzalez@email.com',
          whatsapp: '+34612345678',
          instagram: '@mariadev',
          facebook: 'maria.gonzalez.dev',
          linkedin: 'maria-gonzalez-dev'
        },
        experience: {
          years: 8,
          description: 'Especializada en desarrollo full stack con un historial comprobado de proyectos exitosos y clientes satisfechos.'
        },
        reviewData: {
          averageRating: 4.9,
          totalReviews: 127,
          hasReviews: true
        },
        qa: {
          hasQuestions: false,
          totalQuestions: 0
        }
      },
      {
        id: '2',
        name: 'Carlos Rodríguez',
        profession: 'Diseñador UX/UI',
        category: 'diseno',
        rating: 4.8,
        reviews: 93,
        location: 'Barcelona, España',
        skills: ['Figma', 'Adobe XD', 'Prototyping', 'Design Systems', 'User Research'],
        description: 'Diseñador UX/UI especializado en crear experiencias digitales intuitivas y atractivas.',
        pricePerHour: 75,
        isVerified: true,
        status: 'busy',
        completedProjects: 116,
        responseRate: 98,
        responseTime: '2 horas',
        workZones: ['Barcelona', 'Cataluña', 'Tarragona', 'Girona'],
        aboutMe: 'Diseñador UX/UI apasionado por crear experiencias digitales intuitivas y atractivas. Experto en Figma y sistemas de diseño.',
        contactInfo: {
          email: 'carlos.rodriguez@email.com',
          whatsapp: '+34623456789',
          instagram: '@carlosux',
          facebook: 'carlos.rodriguez.ux',
          linkedin: 'carlos-rodriguez-ux'
        },
        experience: {
          years: 5,
          description: 'Especializado en diseño UX/UI con un historial comprobado de proyectos exitosos y clientes satisfechos.'
        },
        reviewData: {
          averageRating: 4.8,
          totalReviews: 93,
          hasReviews: true
        },
        qa: {
          hasQuestions: true,
          totalQuestions: 3
        }
      },
      {
        id: '3',
        name: 'Ana Martínez',
        profession: 'Consultora de Marketing Digital',
        category: 'marketing',
        rating: 5.0,
        reviews: 156,
        location: 'Valencia, España',
        skills: ['SEO', 'Google Ads', 'Analytics', 'Social Media', 'Content Marketing'],
        description: 'Consultora de Marketing Digital con experiencia en estrategias de crecimiento online.',
        pricePerHour: 95,
        isVerified: true,
        status: 'available',
        completedProjects: 67,
        responseRate: 92,
        responseTime: '3 horas',
        workZones: ['Valencia', 'Comunidad Valenciana'],
        aboutMe: 'Consultora de marketing digital con experiencia en SEO, Google Ads y estrategias de crecimiento digital.',
        contactInfo: {
          email: 'ana.martinez@email.com',
          whatsapp: '+34634567890',
          instagram: '@anamarketing',
          facebook: 'ana.martinez.marketing',
          linkedin: 'ana-martinez-marketing'
        },
        experience: {
          years: 6,
          description: 'Especializada en marketing digital con un historial comprobado de proyectos exitosos y clientes satisfechos.'
        },
        reviewData: {
          averageRating: 5.0,
          totalReviews: 156,
          hasReviews: true
        },
        qa: {
          hasQuestions: false,
          totalQuestions: 0
        }
      },
      {
        id: '4',
        name: 'Javier López',
        profession: 'Fotógrafo Profesional',
        category: 'diseno',
        rating: 4.7,
        reviews: 89,
        location: 'Sevilla, España',
        skills: ['Fotografía de eventos', 'Retrato', 'Producto', 'Post-producción'],
        description: 'Fotógrafo profesional especializado en eventos corporativos y sesiones de retrato.',
        pricePerHour: 65,
        isVerified: true,
        status: 'available',
        completedProjects: 67,
        responseRate: 92,
        responseTime: '3 horas',
        workZones: ['Valencia', 'Comunidad Valenciana'],
        aboutMe: 'Consultora de marketing digital con experiencia en SEO, Google Ads y estrategias de crecimiento digital.',
        contactInfo: {
          email: 'ana.martinez@email.com',
          whatsapp: '+34634567890',
          instagram: '@anamarketing',
          facebook: 'ana.martinez.marketing',
          linkedin: 'ana-martinez-marketing'
        },
        experience: {
          years: 4,
          description: 'Especializado en fotografía profesional con un historial comprobado de proyectos exitosos y clientes satisfechos.'
        },
        reviewData: {
          averageRating: 4.7,
          totalReviews: 89,
          hasReviews: true
        },
        qa: {
          hasQuestions: true,
          totalQuestions: 2
        }
      },
      {
        id: '5',
        name: 'Laura Sánchez',
        profession: 'Arquitecta',
        category: 'construccion',
        rating: 4.8,
        reviews: 112,
        location: 'Bilbao, España',
        skills: ['Diseño arquitectónico', 'Planos', 'Supervisión de obra', 'Sostenibilidad'],
        description: 'Arquitecta con más de 10 años de experiencia en diseño residencial y comercial.',
        pricePerHour: 70,
        isVerified: true,
        status: 'available',
        completedProjects: 67,
        responseRate: 92,
        responseTime: '3 horas',
        workZones: ['Valencia', 'Comunidad Valenciana'],
        aboutMe: 'Consultora de marketing digital con experiencia en SEO, Google Ads y estrategias de crecimiento digital.',
        contactInfo: {
          email: 'ana.martinez@email.com',
          whatsapp: '+34634567890',
          instagram: '@anamarketing',
          facebook: 'ana.martinez.marketing',
          linkedin: 'ana-martinez-marketing'
        },
        experience: {
          years: 7,
          description: 'Especializada en arquitectura con un historial comprobado de proyectos exitosos y clientes satisfechos.'
        },
        reviewData: {
          averageRating: 4.8,
          totalReviews: 112,
          hasReviews: true
        },
        qa: {
          hasQuestions: false,
          totalQuestions: 0
        }
      },
      {
        id: '6',
        name: 'Miguel Torres',
        profession: 'Chef Ejecutivo',
        category: 'gastronomia',
        rating: 4.9,
        reviews: 134,
        location: 'Málaga, España',
        skills: ['Cocina mediterránea', 'Pastelería', 'Catering', 'Gestión de cocina'],
        description: 'Chef ejecutivo especializado en cocina mediterránea con experiencia en restaurantes Michelin.',
        pricePerHour: 80,
        isVerified: true,
        status: 'available',
        completedProjects: 67,
        responseRate: 92,
        responseTime: '3 horas',
        workZones: ['Valencia', 'Comunidad Valenciana'],
        aboutMe: 'Consultora de marketing digital con experiencia en SEO, Google Ads y estrategias de crecimiento digital.',
        contactInfo: {
          email: 'ana.martinez@email.com',
          whatsapp: '+34634567890',
          instagram: '@anamarketing',
          facebook: 'ana.martinez.marketing',
          linkedin: 'ana-martinez-marketing'
        },
        experience: {
          years: 9,
          description: 'Especializado en gastronomía con un historial comprobado de proyectos exitosos y clientes satisfechos.'
        },
        reviewData: {
          averageRating: 4.9,
          totalReviews: 134,
          hasReviews: true
        },
        qa: {
          hasQuestions: true,
          totalQuestions: 1
        }
      },
      {
        id: '7',
        name: 'Javier López',
        profession: 'Ingeniero DevOps',
        category: 'tecnologia',
        rating: 4.7,
        reviews: 84,
        location: 'Sevilla, España',
        skills: ['AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Terraform'],
        description: 'Ingeniero DevOps con experiencia en infraestructura cloud y automatización.',
        pricePerHour: 90,
        isVerified: true,
        status: 'available',
        completedProjects: 67,
        responseRate: 92,
        responseTime: '3 horas',
        workZones: ['Valencia', 'Comunidad Valenciana'],
        aboutMe: 'Consultora de marketing digital con experiencia en SEO, Google Ads y estrategias de crecimiento digital.',
        contactInfo: {
          email: 'ana.martinez@email.com',
          whatsapp: '+34634567890',
          instagram: '@anamarketing',
          facebook: 'ana.martinez.marketing',
          linkedin: 'ana-martinez-marketing'
        },
        experience: {
          years: 6,
          description: 'Especializado en DevOps con un historial comprobado de proyectos exitosos y clientes satisfechos.'
        },
        reviewData: {
          averageRating: 4.7,
          totalReviews: 84,
          hasReviews: true
        },
        qa: {
          hasQuestions: false,
          totalQuestions: 0
        }
      },
      {
        id: '8',
        name: 'Sofia García',
        profession: 'Data Scientist',
        category: 'tecnologia',
        rating: 4.8,
        reviews: 67,
        location: 'Bilbao, España',
        skills: ['Python', 'Machine Learning', 'SQL', 'TensorFlow', 'Pandas'],
        description: 'Data Scientist especializada en machine learning y análisis de datos.',
        pricePerHour: 85,
        isVerified: true,
        status: 'available',
        completedProjects: 45,
        responseRate: 88,
        responseTime: '4 horas',
        workZones: ['Bilbao', 'Vizcaya', 'Guipúzcoa', 'Álava'],
        aboutMe: 'Data Scientist especializada en machine learning y análisis de datos. Experta en Python, TensorFlow y análisis estadístico avanzado.',
        contactInfo: {
          email: 'sofia.garcia@email.com',
          whatsapp: '+34645678901',
          instagram: '@sofiadata',
          facebook: 'sofia.garcia.data',
          linkedin: 'sofia-garcia-data'
        },
        experience: {
          years: 5,
          description: 'Especializada en Data Science con un historial comprobado de proyectos exitosos y clientes satisfechos.'
        },
        reviewData: {
          averageRating: 4.8,
          totalReviews: 67,
          hasReviews: true
        },
        qa: {
          hasQuestions: true,
          totalQuestions: 2
        }
      }
    ];

    this.professionalsSubject.next(sampleData);
  }

  // Métodos para manejar filtros
  setSpecialtyFilter(specialty: string) {
    this.specialtyFilter.next(specialty);
  }

  setLocationFilter(location: string) {
    this.locationFilter.next(location);
  }

  setSearchQuery(query: string) {
    this.searchQuery.next(query);
  }

  // Obtener opciones de filtros
  getSpecialties(): string[] {
    return ['all', 'tecnologia', 'diseno', 'marketing', 'construccion', 'gastronomia', 'eventos'];
  }

  getLocations(): string[] {
    return ['all', 'madrid', 'barcelona', 'valencia', 'sevilla', 'bilbao', 'malaga', 'zaragoza'];
  }

  getProfessionals(): Observable<Professional[]> {
    return this.professionals$;
  }

  getProfessionalsByCategory(category: string): Observable<Professional[]> {
    return this.professionals$.pipe(
      map(professionals => professionals.filter(prof => prof.category === category))
    );
  }

  searchProfessionals(query: string): Observable<Professional[]> {
    const lowercaseQuery = query.toLowerCase();
    return this.professionals$.pipe(
      map(professionals => professionals.filter(prof =>
        prof.name.toLowerCase().includes(lowercaseQuery) ||
        prof.profession.toLowerCase().includes(lowercaseQuery) ||
        prof.skills.some(skill => skill.toLowerCase().includes(lowercaseQuery))
      ))
    );
  }

  getProfessionalById(id: string): Observable<Professional | undefined> {
    return this.professionals$.pipe(
      map(professionals => professionals.find(prof => prof.id === id))
    );
  }
}
