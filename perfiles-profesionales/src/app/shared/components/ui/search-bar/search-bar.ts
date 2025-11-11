import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonSearchbar, IonButton, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { search } from 'ionicons/icons';
import { ApiService } from '../../../../core/services/api.service';
import { DataMapperService } from '../../../services/data-mapper.service';
import { ApiProfessionalsResponse } from '../../../interfaces/api-response.interface';

@Component({
  selector: 'app-search-bar',
  imports: [CommonModule, FormsModule, IonSearchbar, IonButton, IonIcon],
  templateUrl: './search-bar.html',
  styleUrl: './search-bar.css'
})
export class SearchBarComponent {
  searchQuery = '';
  isLoading = false;

  constructor(
    private router: Router,
    private apiService: ApiService,
    private dataMapper: DataMapperService
  ) {
    addIcons({ search });
  }

  onSearch() {
    // Permitir búsqueda solo si hay texto
    if (this.searchQuery.trim()) {
      this.isLoading = true;

      // Llamar al endpoint del backend
      let params = this.apiService.createParams({
        page: '1',
        limit: '6'
      });

      // Agregar search
      params = params.set('search', this.searchQuery.trim());

      this.apiService.get<ApiProfessionalsResponse>('/api/professionals', params).subscribe({
        next: (apiResponse) => {
          const professionals = this.dataMapper.mapApiResponseToProfessionals(apiResponse);

          // Navegar a la página de profesionales con los resultados
          this.router.navigate(['/professionals'], {
            queryParams: {
              search: this.searchQuery.trim() || 'all',
              results: professionals.length
            }
          });

          this.isLoading = false;
        },
        error: (error) => {
          console.error('❌ Error al buscar profesionales:', error);

          // En caso de error, navegar de todas formas pero sin resultados
          this.router.navigate(['/professionals'], {
            queryParams: {
              search: this.searchQuery.trim() || 'all',
              error: 'search_failed'
            }
          });

          this.isLoading = false;
        }
      });
    }
  }

  // Getter para verificar si se puede buscar
  get canSearch(): boolean {
    return !!this.searchQuery.trim();
  }

  onSearchInput(event: any) {
    this.searchQuery = event.detail.value;
  }

  // Método para limpiar el search bar
  clearSearch() {
    this.searchQuery = '';
  }
}
