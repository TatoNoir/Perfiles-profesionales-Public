import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonCard, IonCardContent, IonButton, IonIcon, IonGrid, IonRow, IonCol, IonChip, IonSpinner } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { checkmarkCircle, star, starHalf, starOutline, location, eye } from 'ionicons/icons';
import { ProfessionalBasic } from '../../pages/professionals/services/professionals-list.service';

@Component({
  selector: 'app-professionals-list',
  imports: [CommonModule, IonCard, IonCardContent, IonButton, IonIcon, IonGrid, IonRow, IonCol, IonChip, IonSpinner],
  templateUrl: './professionals-list.html',
  styleUrl: './professionals-list.css'
})
export class ProfessionalsListComponent {
  @Input() professionals: ProfessionalBasic[] = [];
  @Input() displayedProfessionals: ProfessionalBasic[] = [];
  @Input() isLoading = false;
  @Input() hasMoreData = true;

  @Output() loadMore = new EventEmitter<void>();
  @Output() viewProfile = new EventEmitter<ProfessionalBasic>();

  constructor() {
    addIcons({ checkmarkCircle, star, starHalf, starOutline, location, eye });
  }

  onViewProfile(professional: ProfessionalBasic) {
    this.viewProfile.emit(professional);
  }

  getStatusColor(professional: ProfessionalBasic): string {
    const statuses = ['#10B981', '#F59E0B', '#EF4444'];
    const index = professional.id.charCodeAt(0) % statuses.length;
    return statuses[index];
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
