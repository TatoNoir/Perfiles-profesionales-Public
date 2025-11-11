import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonSearchbar, IonButton, IonIcon, IonButtons, IonItem, IonSelect, IonSelectOption } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { search, refresh } from 'ionicons/icons';
import { FiltersSidebarComponent } from '../../../../shared/components/ui/filters-sidebar/filters-sidebar';
import { ProfessionalsListComponent } from '../../components/professionals-list/professionals-list';
import { ProfessionalsListService, ProfessionalBasic } from './services/professionals-list.service';
import { SharedDataService, GeoState, GeoLocality } from '../../../../shared/services/shared-data.service';

@Component({
  selector: 'app-professionals',
  imports: [CommonModule, FormsModule, RouterModule, IonContent, IonHeader, IonTitle, IonToolbar, IonSearchbar, IonButton, IonIcon, IonButtons, IonItem, IonSelect, IonSelectOption, FiltersSidebarComponent, ProfessionalsListComponent],
  templateUrl: './professionals.html',
  styleUrl: './professionals.css'
})
export class ProfessionalsComponent implements OnInit, OnDestroy {
  searchQuery = '';
  professionals: ProfessionalBasic[] = [];
  displayedProfessionals: ProfessionalBasic[] = [];
  isLoading = false;
  hasMoreData = true;
  isSearching = false;
  hasActiveSearch = false;

  // Filtros de ubicación para búsqueda
  provinces: GeoState[] = [];
  selectedProvince: number | null = null;
  cities: GeoLocality[] = [];
  selectedCity: number | null = null;

  // Filtros de ubicación del sidebar
  selectedStateId: number | null = null;
  selectedLocalityId: number | null = null;

  private itemsPerPage = 6;
  private currentPage = 0;
  private subscription: Subscription = new Subscription();

  constructor(
    private professionalsListService: ProfessionalsListService,
    private router: Router,
    private route: ActivatedRoute,
    private sharedDataService: SharedDataService
  ) {
    addIcons({ search, refresh });
  }

  ngOnInit() {
    this.loadProvinces();
    // Verificar si hay parámetros de consulta para filtrar por actividad o búsqueda
    this.route.queryParams.subscribe(params => {
      if (params['activity']) {
        this.searchQuery = params['activity'];
        // Hacer búsqueda por actividad en el backend
        this.searchByActivity(params['activity']);
      } else if (params['search']) {
        this.searchQuery = params['search'];
        // Hacer búsqueda por actividad directamente
        this.searchByActivity(params['search']);
      } else {
        // Solo cargar lista completa si no hay parámetros de búsqueda
        this.loadProfessionals();
      }
    });
  }

  loadProvinces() {
    this.sharedDataService.getProvincesByCountry(13).subscribe({
      next: (provinces) => {
        this.provinces = provinces;
      },
      error: (error) => {
        console.error('Error loading provinces:', error);
      }
    });
  }

  onProvinceChange(event: any) {
    const provinceId = event.detail.value;
    this.selectedProvince = provinceId && provinceId !== 'all' ? parseInt(provinceId) : null;
    this.selectedCity = null;
    this.cities = [];

    if (this.selectedProvince) {
      this.sharedDataService.getLocalitiesByState(this.selectedProvince).subscribe({
        next: (cities) => {
          this.cities = cities;
        },
        error: (error) => {
          console.error('Error loading cities:', error);
        }
      });
    }
  }

  onCityChange(event: any) {
    const cityId = event.detail.value;
    this.selectedCity = cityId && cityId !== 'all' ? parseInt(cityId) : null;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private loadProfessionals() {
    // Cargar todos los profesionales del API
    this.subscription.add(
      this.professionalsListService.getProfessionals(
        this.selectedStateId || undefined,
        this.selectedLocalityId || undefined
      ).subscribe(professionals => {
        this.professionals = professionals;
        this.resetPagination();
        this.loadMoreProfessionals();
      })
    );
  }

  private resetPagination() {
    this.currentPage = 0;
    this.displayedProfessionals = [];
    this.hasMoreData = true;
  }

  loadMoreProfessionals() {
    if (this.isLoading || !this.hasMoreData) return;

    this.isLoading = true;

    // Simular carga asíncrona
    setTimeout(() => {
      const startIndex = this.currentPage * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
      const newProfessionals = this.professionals.slice(startIndex, endIndex);

      this.displayedProfessionals = [...this.displayedProfessionals, ...newProfessionals];
      this.currentPage++;

      // Verificar si hay más datos
      this.hasMoreData = endIndex < this.professionals.length;
      this.isLoading = false;
    }, 500);
  }

  onScroll(event: any) {
    if (this.isLoading || !this.hasMoreData) return;

    const scrollElement = event.target;
    const scrollTop = scrollElement.scrollTop;
    const scrollHeight = scrollElement.scrollHeight;
    const clientHeight = scrollElement.clientHeight;

      // Cargar más cuando estemos cerca del final (200px antes)
      if (scrollTop + clientHeight >= scrollHeight - 200) {
        this.loadMoreProfessionals();
      }
  }

  onLoadMore() {
    this.loadMoreProfessionals();
  }

  onViewProfile(professional: ProfessionalBasic) {
    this.router.navigate(['/professionals', professional.id]);
  }

  onSearch() {
    // Permitir búsqueda si hay texto O si hay filtros de ubicación
    if (this.searchQuery.trim() || this.selectedProvince || this.selectedCity) {
      const activityTerm = this.searchQuery.trim() || undefined;
      this.searchByActivity(activityTerm);
    }
  }

  private searchByActivityId(activityId: number) {
    this.isSearching = true;

    // Llamar al endpoint del backend para buscar por activity_id con filtros de ubicación
    this.professionalsListService.searchProfessionalsByActivity(
      activityId,
      this.selectedStateId || undefined,
      this.selectedLocalityId || undefined
    ).subscribe({
      next: (professionals) => {
        this.professionals = professionals;
        this.resetPagination();
        this.loadMoreProfessionals();
        this.isSearching = false;
        this.hasActiveSearch = true; // Marcar que hay búsqueda activa
      },
      error: (error) => {
        console.error('❌ Error al buscar profesionales:', error);
        this.isSearching = false;
      }
    });
  }

  private searchByActivity(activityTerm?: string) {
    // NOTA: Este método se mantiene por compatibilidad pero actualmente no se usa
    // La búsqueda ahora se hace por activity_id a través de searchByActivityId
    // TODO: Implementar búsqueda por texto si es necesario en el futuro
    console.warn('searchByActivity con texto no está implementado. Usar activity_id en su lugar.');
    this.onShowAll();
  }

  // Getter para verificar si se puede buscar
  get canSearch(): boolean {
    return !!(this.searchQuery.trim() || this.selectedProvince || this.selectedCity);
  }

  onShowAll() {
    this.searchQuery = '';
    this.hasActiveSearch = false;
    // Limpiar filtros de ubicación de búsqueda
    this.selectedProvince = null;
    this.selectedCity = null;
    this.cities = [];
    this.loadProfessionals();
  }

  onActivitySelected(activityId: number | null) {
    if (activityId !== null && activityId !== undefined) {
      // Buscar profesionales por activity_id
      this.searchByActivityId(activityId);
    } else {
      // Si se selecciona "all", mostrar todos
      this.onShowAll();
    }
  }

  onProvinceSelected(stateId: number | null) {
    this.selectedStateId = stateId;
    this.selectedLocalityId = null; // Reset ciudad cuando cambia provincia
    this.loadProfessionals(); // Recargar con el nuevo filtro
  }

  onCitySelected(localityId: number | null) {
    this.selectedLocalityId = localityId;
    this.loadProfessionals(); // Recargar con el nuevo filtro
  }

  onSearchInputEvent(event: any) {
    this.searchQuery = event.detail.value;
    // this.professionalsListService.setSearchQuery(this.searchQuery); // Desactivado para búsqueda manual con botón
  }
}
