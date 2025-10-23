import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonCard, IonCardContent, IonButton, IonIcon, IonGrid, IonRow, IonCol, IonChip, IonSpinner } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { checkmarkCircle, star, location, eye } from 'ionicons/icons';
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
    addIcons({ checkmarkCircle, star, location, eye });
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
}
