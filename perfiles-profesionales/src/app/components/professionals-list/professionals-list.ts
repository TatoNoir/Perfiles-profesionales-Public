import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { IonCard, IonCardContent, IonButton, IonIcon, IonGrid, IonRow, IonCol, IonChip, IonSpinner } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { checkmarkCircle, star, location, eye } from 'ionicons/icons';
import { ProfessionalService, Professional } from '../../services/professional';

@Component({
  selector: 'app-professionals-list',
  imports: [CommonModule, IonCard, IonCardContent, IonButton, IonIcon, IonGrid, IonRow, IonCol, IonChip, IonSpinner],
  templateUrl: './professionals-list.html',
  styleUrl: './professionals-list.css'
})
export class ProfessionalsListComponent implements OnInit, OnDestroy {
  professionals: Professional[] = [];
  displayedProfessionals: Professional[] = [];
  isLoading = false;
  hasMoreData = true;

  private itemsPerPage = 4;
  private currentPage = 0;
  private subscription: Subscription = new Subscription();

  constructor(
    private professionalService: ProfessionalService,
    private router: Router
  ) {
    addIcons({ checkmarkCircle, star, location, eye });
  }

  ngOnInit() {
    this.loadProfessionals();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private loadProfessionals() {
    this.subscription = this.professionalService.filteredProfessionals$.subscribe(professionals => {
      this.professionals = professionals;
      this.resetPagination();
      this.loadMoreProfessionals();
    });
  }

  private resetPagination() {
    this.currentPage = 0;
    this.displayedProfessionals = [];
    this.hasMoreData = true;
  }

  private loadMoreProfessionals() {
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

  @HostListener('window:scroll')
  onScroll() {
    if (this.isLoading || !this.hasMoreData) return;

    const scrollPosition = window.pageYOffset;
    const windowSize = window.innerHeight;
    const bodyHeight = document.body.offsetHeight;

    // Cargar más cuando estemos cerca del final (100px antes)
    if (scrollPosition + windowSize >= bodyHeight - 100) {
      this.loadMoreProfessionals();
    }
  }

  onViewProfile(professional: Professional) {
    console.log('Ver perfil de:', professional.name);
    this.router.navigate(['/professionals', professional.id]);
  }

  getStatusColor(professional: Professional): string {
    const statuses = ['#10B981', '#F59E0B', '#EF4444'];
    const index = professional.id.charCodeAt(0) % statuses.length;
    return statuses[index];
  }

  trackByProfessionalId(index: number, professional: Professional): string {
    return professional.id;
  }
}
