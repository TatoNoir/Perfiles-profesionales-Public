import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonButton, IonIcon, IonGrid, IonRow, IonCol, IonChip } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { checkmarkCircle, star, location, eye } from 'ionicons/icons';
import { ProfessionalsListService } from '../../pages/professionals/services/professionals-list.service';
import { ProfessionalBasic } from '../../pages/professionals/services/professionals-list.service';

@Component({
  selector: 'app-professional-cards',
  imports: [CommonModule, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonButton, IonIcon, IonGrid, IonRow, IonCol, IonChip],
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
    addIcons({ checkmarkCircle, star, location, eye });
  }

  ngOnInit() {
    this.subscription = this.professionalsListService.getProfessionals()
      .pipe(
        map(professionals => professionals.slice(0, 6))
      )
      .subscribe(professionals => {
        this.latestProfessionals = professionals;
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onViewProfile(professional: ProfessionalBasic) {
    console.log('Ver perfil de:', professional.name);
    this.router.navigate(['/professionals', professional.id]);
  }

  onViewAll() {
    console.log('Ver todos los perfiles');
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
}
