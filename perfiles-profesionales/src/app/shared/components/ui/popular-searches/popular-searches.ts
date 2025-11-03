import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonChip } from '@ionic/angular/standalone';

interface PopularSearch {
  id: string;
  name: string;
  category: string;
}

@Component({
  selector: 'app-popular-searches',
  imports: [CommonModule, IonChip],
  templateUrl: './popular-searches.html',
  styleUrl: './popular-searches.css'
})
export class PopularSearchesComponent {
  popularSearches: PopularSearch[] = [
    { id: '1', name: 'Desarrollo Web', category: 'tecnologia' },
    { id: '2', name: 'Diseño Gráfico', category: 'diseno' },
    { id: '3', name: 'Marketing Digital', category: 'marketing' },
    { id: '4', name: 'Fotografía', category: 'diseno' },
    { id: '5', name: 'Consultoría', category: 'consultoria' },
    { id: '6', name: 'Arquitectura', category: 'construccion' },
    { id: '7', name: 'Catering', category: 'gastronomia' },
    { id: '8', name: 'Organización de Eventos', category: 'eventos' }
  ];

  onSearchClick(search: PopularSearch) {
    // Aquí implementaremos la navegación a la búsqueda
  }

  trackBySearchId(index: number, search: PopularSearch): string {
    return search.id;
  }
}
