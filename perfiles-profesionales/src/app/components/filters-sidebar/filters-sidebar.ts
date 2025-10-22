import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonRadio, IonRadioGroup, IonLabel, IonItem } from '@ionic/angular/standalone';
import { ProfessionalsListService } from '../../pages/professionals/services/professionals-list.service';

@Component({
  selector: 'app-filters-sidebar',
  imports: [CommonModule, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonRadio, IonRadioGroup, IonLabel, IonItem],
  templateUrl: './filters-sidebar.html',
  styleUrl: './filters-sidebar.css'
})
export class FiltersSidebarComponent implements OnInit, OnDestroy {
  specialties: { value: string; label: string }[] = [];
  locations: { value: string; label: string }[] = [];

  selectedSpecialty = 'all';
  selectedLocation = 'all';

  private subscription: Subscription = new Subscription();

  constructor(private professionalsListService: ProfessionalsListService) {}

  ngOnInit() {
    this.loadFilterOptions();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private loadFilterOptions() {
    // Especialidades
    this.specialties = [
      { value: 'all', label: 'Todos' },
      { value: 'tecnologia', label: 'Desarrollo Web' },
      { value: 'diseno', label: 'Diseño' },
      { value: 'marketing', label: 'Marketing' },
      { value: 'construccion', label: 'Infraestructura' },
      { value: 'gastronomia', label: 'Desarrollo Mobile' },
      { value: 'eventos', label: 'Data Science' }
    ];

    // Ubicaciones
    this.locations = [
      { value: 'all', label: 'Todas las ubicaciones' },
      { value: 'madrid', label: 'Madrid, España' },
      { value: 'barcelona', label: 'Barcelona, España' },
      { value: 'valencia', label: 'Valencia, España' },
      { value: 'sevilla', label: 'Sevilla, España' },
      { value: 'bilbao', label: 'Bilbao, España' },
      { value: 'malaga', label: 'Málaga, España' },
      { value: 'zaragoza', label: 'Zaragoza, España' }
    ];
  }

  onSpecialtyChange(specialty: string) {
    this.selectedSpecialty = specialty;
    this.professionalsListService.setSpecialtyFilter(specialty);
  }

  onLocationChange(location: string) {
    this.selectedLocation = location;
    this.professionalsListService.setLocationFilter(location);
  }
}
