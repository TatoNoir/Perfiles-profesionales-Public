import { Component } from '@angular/core';
import { IonSearchbar, IonButton, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { search } from 'ionicons/icons';

@Component({
  selector: 'app-search-bar',
  imports: [IonSearchbar, IonButton, IonIcon],
  templateUrl: './search-bar.html',
  styleUrl: './search-bar.css'
})
export class SearchBarComponent {
  searchQuery = '';

  constructor() {
    addIcons({ search });
  }

  onSearch() {
    if (this.searchQuery.trim()) {
      // Aquí implementaremos la lógica de búsqueda
    }
  }

  onSearchInput(event: any) {
    this.searchQuery = event.detail.value;
  }
}
