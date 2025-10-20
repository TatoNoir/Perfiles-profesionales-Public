import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { FiltersSidebarComponent } from '../../components/filters-sidebar/filters-sidebar';
import { ProfessionalsListComponent } from '../../components/professionals-list/professionals-list';
import { ProfessionalService } from '../../services/professional';

@Component({
  selector: 'app-professionals',
  imports: [CommonModule, FormsModule, FiltersSidebarComponent, ProfessionalsListComponent],
  templateUrl: './professionals.html',
  styleUrl: './professionals.css'
})
export class ProfessionalsComponent implements OnInit, OnDestroy {
  searchQuery = '';
  private subscription: Subscription = new Subscription();

  constructor(private professionalService: ProfessionalService) {}

  ngOnInit() {
    // Inicializar con búsqueda vacía
    this.professionalService.setSearchQuery('');
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onSearch() {
    this.professionalService.setSearchQuery(this.searchQuery);
  }

  onSearchInput() {
    // Búsqueda en tiempo real mientras el usuario escribe
    this.professionalService.setSearchQuery(this.searchQuery);
  }
}
