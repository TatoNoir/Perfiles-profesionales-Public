import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProfessionalService, Professional } from '../../services/professional';

@Component({
  selector: 'app-professional-cards',
  imports: [CommonModule],
  templateUrl: './professional-cards.html',
  styleUrl: './professional-cards.css'
})
export class ProfessionalCardsComponent implements OnInit, OnDestroy {
  latestProfessionals: Professional[] = [];
  private subscription: Subscription = new Subscription();

  constructor(private professionalService: ProfessionalService) {}

  ngOnInit() {
    this.subscription = this.professionalService.getProfessionals()
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

  onViewProfile(professional: Professional) {
    console.log('Ver perfil de:', professional.name);
    // Aquí implementaremos la navegación al perfil
  }

  onViewAll() {
    console.log('Ver todos los perfiles');
    // Aquí implementaremos la navegación a la lista completa
  }

  getStatusColor(professional: Professional): string {
    // Simulamos diferentes estados de conexión
    const statuses = ['#10B981', '#F59E0B', '#EF4444'];
    const index = professional.id.charCodeAt(0) % statuses.length;
    return statuses[index];
  }

  getStatusText(professional: Professional): string {
    const colors = this.getStatusColor(professional);
    if (colors === '#10B981') return 'En línea';
    if (colors === '#F59E0B') return 'Ausente';
    return 'Desconectado';
  }

  trackByProfessionalId(index: number, professional: Professional): string {
    return professional.id;
  }
}
