import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonSearchbar } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { search } from 'ionicons/icons';
import { FiltersSidebarComponent } from '../../components/filters-sidebar/filters-sidebar';
import { ProfessionalsListComponent } from '../../components/professionals-list/professionals-list';
import { ProfessionalsListService, ProfessionalBasic } from './services/professionals-list.service';

@Component({
  selector: 'app-professionals',
  imports: [CommonModule, IonContent, IonHeader, IonTitle, IonToolbar, IonSearchbar, FiltersSidebarComponent, ProfessionalsListComponent],
  templateUrl: './professionals.html',
  styleUrl: './professionals.css'
})
export class ProfessionalsComponent implements OnInit, OnDestroy {
  searchQuery = '';
  professionals: ProfessionalBasic[] = [];
  displayedProfessionals: ProfessionalBasic[] = [];
  isLoading = false;
  hasMoreData = true;

  private itemsPerPage = 4;
  private currentPage = 0;
  private subscription: Subscription = new Subscription();

  constructor(
    private professionalsListService: ProfessionalsListService,
    private router: Router
  ) {
    addIcons({ search });
  }

  ngOnInit() {
    // Inicializar con búsqueda vacía
    this.professionalsListService.setSearchQuery('');
    this.loadProfessionals();
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

    // Cargar más cuando estemos cerca del final (100px antes)
    if (scrollTop + clientHeight >= scrollHeight - 100) {
      this.loadMoreProfessionals();
    }
  }

  onViewProfile(professional: ProfessionalBasic) {
    this.router.navigate(['/professionals', professional.id]);
  }

  onSearch() {
    this.professionalsListService.setSearchQuery(this.searchQuery);
  }

  onSearchInput() {
    // Búsqueda en tiempo real mientras el usuario escribe
    this.professionalsListService.setSearchQuery(this.searchQuery);
  }

  onSearchInputEvent(event: any) {
    this.searchQuery = event.detail.value;
    this.onSearchInput();
  }
}
