import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { IonCard, IonCardContent, IonButton, IonIcon, IonGrid, IonRow, IonCol, IonChip } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { checkmarkCircle, star, starHalf, starOutline, location, eye } from 'ionicons/icons';
import { ProfessionalsListService, ProfessionalBasic } from '../../../../features/professionals/pages/professionals-list/services/professionals-list.service';
import { ProfilePhotoThumbnailComponent } from '../profile-photo-thumbnail/profile-photo-thumbnail';

@Component({
  selector: 'app-professional-cards',
  imports: [CommonModule, IonCard, IonCardContent, IonButton, IonIcon, IonGrid, IonRow, IonCol, IonChip, ProfilePhotoThumbnailComponent],
  templateUrl: './professional-cards.html',
  styleUrl: './professional-cards.css'
})
export class ProfessionalCardsComponent implements OnInit, OnDestroy {
  latestProfessionals: ProfessionalBasic[] = [];
  private subscription: Subscription = new Subscription();

constructor(
    private professionalsListService: ProfessionalsListService,
    private router: Router
  ) {
addIcons({ checkmarkCircle, star, starHalf, starOutline, location, eye });
  }

  ngOnInit() {
    this.subscription = this.professionalsListService.getProfessionalsForHome()
      .subscribe(professionals => {
        this.latestProfessionals = professionals;
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onViewProfile(professional: ProfessionalBasic) {
    this.router.navigate(['/professionals', professional.id]);
  }

  onViewAll() {
    this.router.navigate(['/professionals']);
  }

  getStatusColor(professional: ProfessionalBasic): string {
    // Simulamos diferentes estados de conexión
    const statuses = ['#10B981', '#F59E0B', '#EF4444'];
    const index = professional.id.charCodeAt(0) % statuses.length;
    return statuses[index];
  }

  getStatusText(professional: ProfessionalBasic): string {
    const colors = this.getStatusColor(professional);
    if (colors === '#10B981') return 'En línea';
    if (colors === '#F59E0B') return 'Ausente';
    return 'Desconectado';
  }

  trackByProfessionalId(index: number, professional: ProfessionalBasic): string {
    return professional.id;
  }

  getStarsArray(rating: number): string[] {
    const stars: string[] = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    // Agregar estrellas llenas
    for (let i = 0; i < fullStars; i++) {
      stars.push('full');
    }

    // Agregar media estrella si es necesario
    if (hasHalfStar) {
      stars.push('half');
    }

    // Completar con estrellas vacías hasta 5
    while (stars.length < 5) {
      stars.push('empty');
    }

    return stars;
  }
}
