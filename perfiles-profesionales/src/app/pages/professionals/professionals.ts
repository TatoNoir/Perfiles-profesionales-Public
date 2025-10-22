import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonSearchbar } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { search } from 'ionicons/icons';
import { FiltersSidebarComponent } from '../../components/filters-sidebar/filters-sidebar';
import { ProfessionalsListComponent } from '../../components/professionals-list/professionals-list';
import { ProfessionalsListService } from './services/professionals-list.service';

@Component({
  selector: 'app-professionals',
  imports: [CommonModule, IonContent, IonHeader, IonTitle, IonToolbar, IonSearchbar, FiltersSidebarComponent, ProfessionalsListComponent],
  templateUrl: './professionals.html',
  styleUrl: './professionals.css'
})
export class ProfessionalsComponent implements OnInit, OnDestroy {
  searchQuery = '';
  private subscription: Subscription = new Subscription();

  constructor(private professionalsListService: ProfessionalsListService) {
    addIcons({ search });
  }

  ngOnInit() {
    // Inicializar con búsqueda vacía
    this.professionalsListService.setSearchQuery('');
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
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
