import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonIcon, IonButtons } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { refresh } from 'ionicons/icons';
import { FiltersSidebarComponent } from '../../../../shared/components/ui/filters-sidebar/filters-sidebar';
import { SearchBarComponent } from '../../../../shared/components/ui/search-bar/search-bar';
import { ProfessionalsListComponent } from '../../components/professionals-list/professionals-list';
import { ProfessionalsListService, ProfessionalBasic } from './services/professionals-list.service';
import { SharedDataService } from '../../../../shared/services/shared-data.service';

@Component({
  selector: 'app-professionals',
  imports: [CommonModule, FormsModule, RouterModule, IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonIcon, IonButtons, FiltersSidebarComponent, SearchBarComponent, ProfessionalsListComponent],
  templateUrl: './professionals.html',
  styleUrl: './professionals.css'
})
export class ProfessionalsComponent implements OnInit, OnDestroy {
  professionals: ProfessionalBasic[] = [];
  displayedProfessionals: ProfessionalBasic[] = [];
  isLoading = false;
  hasMoreData = true;
  hasActiveSearch = false;

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
    addIcons({ refresh });
  }

  ngOnInit() {
    // Verificar si hay parámetros de consulta para filtrar por búsqueda
    this.route.queryParams.subscribe(params => {
      if (params['search'] && params['search'] !== 'all') {
        // Hay una búsqueda activa desde el search bar
        this.hasActiveSearch = true;
        // Hacer la búsqueda con el parámetro search
        this.isLoading = true;
        this.professionalsListService.searchProfessionals(
          params['search'],
          undefined, // activityId
          undefined, // stateId
          undefined  // localityId
        ).subscribe({
          next: (professionals) => {
            this.professionals = professionals;
            this.resetPagination();
            this.isLoading = false; // Poner isLoading en false antes de cargar más
            this.loadMoreProfessionals();
          },
          error: (error) => {
            console.error('❌ Error al buscar profesionales:', error);
            this.isLoading = false;
          }
        });
      } else {
        // Solo cargar lista completa si no hay parámetros de búsqueda
        this.loadProfessionals();
      }
    });
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
    // hasMoreData será true si hay profesionales para mostrar
    this.hasMoreData = this.professionals.length > 0;
  }

  loadMoreProfessionals() {
    // Si no hay profesionales, no hay nada que mostrar
    if (this.professionals.length === 0) {
      this.hasMoreData = false;
      return;
    }

    if (!this.hasMoreData) return;

    const startIndex = this.currentPage * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    const newProfessionals = this.professionals.slice(startIndex, endIndex);

    if (newProfessionals.length > 0) {
      this.displayedProfessionals = [...this.displayedProfessionals, ...newProfessionals];
      this.currentPage++;

      // Verificar si hay más datos
      this.hasMoreData = endIndex < this.professionals.length;
    } else {
      // Si no hay más profesionales para mostrar, marcar como sin más datos
      this.hasMoreData = false;
    }
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

  private searchByActivityId(activityId: number) {
    this.isLoading = true;

    // Llamar al endpoint del backend para buscar por activity_id con filtros de ubicación
    this.professionalsListService.searchProfessionalsByActivity(
      activityId,
      this.selectedStateId || undefined,
      this.selectedLocalityId || undefined
    ).subscribe({
      next: (professionals) => {
        this.professionals = professionals;
        this.resetPagination();
        this.isLoading = false; // Poner isLoading en false antes de cargar más
        this.loadMoreProfessionals();
        this.hasActiveSearch = true; // Marcar que hay búsqueda activa
      },
      error: (error) => {
        console.error('❌ Error al buscar profesionales:', error);
        this.isLoading = false;
      }
    });
  }

  onShowAll() {
    this.hasActiveSearch = false;
    // Limpiar query params y recargar
    this.router.navigate(['/professionals'], { queryParams: {} });
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

}
