import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonSearchbar, IonButton, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { search, refresh } from 'ionicons/icons';
import { FiltersSidebarComponent } from '../../components/filters-sidebar/filters-sidebar';
import { ProfessionalsListComponent } from '../../components/professionals-list/professionals-list';
import { ProfessionalsListService, ProfessionalBasic } from './services/professionals-list.service';

@Component({
  selector: 'app-professionals',
  imports: [CommonModule, RouterModule, IonContent, IonHeader, IonTitle, IonToolbar, IonSearchbar, IonButton, IonIcon, FiltersSidebarComponent, ProfessionalsListComponent],
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

  private itemsPerPage = 6;
  private currentPage = 0;
  private subscription: Subscription = new Subscription();

  constructor(
    private professionalsListService: ProfessionalsListService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    addIcons({ search, refresh });
  }

  ngOnInit() {
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

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private loadProfessionals() {
    // Cargar todos los profesionales del API
    this.subscription.add(
      this.professionalsListService.getProfessionals().subscribe(professionals => {
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
    if (this.searchQuery.trim()) {
      this.searchByActivity(this.searchQuery.trim());
    }
  }

  private searchByActivity(activityTerm: string) {
    this.isSearching = true;

    // Llamar al endpoint del backend para buscar por actividad
    this.professionalsListService.searchProfessionalsByActivity(activityTerm).subscribe({
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

  onShowAll() {
    this.searchQuery = '';
    this.hasActiveSearch = false;
    this.loadProfessionals();
  }

  onActivitySelected(activity: string) {
    if (activity && activity !== 'all') {
      this.searchQuery = activity;
      this.searchByActivity(activity);
    } else {
      // Si se selecciona "all", mostrar todos
      this.onShowAll();
    }
  }

  onSearchInputEvent(event: any) {
    this.searchQuery = event.detail.value;
    // this.professionalsListService.setSearchQuery(this.searchQuery); // Desactivado para búsqueda manual con botón
  }
}
