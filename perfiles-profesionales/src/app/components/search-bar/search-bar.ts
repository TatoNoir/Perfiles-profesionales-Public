import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IonSearchbar, IonButton, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { search } from 'ionicons/icons';
import { ApiService } from '../../services/api.service';
import { DataMapperService } from '../../services/data-mapper.service';
import { ApiProfessionalsResponse } from '../../interfaces/api-response.interface';
import { ProfessionalBasic } from '../../pages/professionals/services/professionals-list.service';

@Component({
  selector: 'app-search-bar',
  imports: [IonSearchbar, IonButton, IonIcon],
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
    if (this.searchQuery.trim()) {
      this.isLoading = true;
      console.log('🔍 Buscando profesionales por actividad:', this.searchQuery);

      // Llamar al endpoint del backend
      const params = this.apiService.createParams({
        activity: this.searchQuery.trim()
      });

      this.apiService.get<ApiProfessionalsResponse>('/api/professionals', params).subscribe({
        next: (apiResponse) => {
          console.log('✅ Respuesta del API para búsqueda:', apiResponse);
          const professionals = this.dataMapper.mapApiResponseToProfessionals(apiResponse);
          console.log('👥 Profesionales encontrados:', professionals);

          // Navegar a la página de profesionales con los resultados
          this.router.navigate(['/professionals'], {
            queryParams: {
              search: this.searchQuery.trim(),
              results: professionals.length
            }
          });

          this.isLoading = false;
        },
        error: (error) => {
          console.error('❌ Error al buscar profesionales:', error);
          console.error('🔍 Detalles del error:', error.message);

          // En caso de error, navegar de todas formas pero sin resultados
          this.router.navigate(['/professionals'], {
            queryParams: {
              search: this.searchQuery.trim(),
              error: 'search_failed'
            }
          });

          this.isLoading = false;
        }
      });
    }
  }

  onSearchInput(event: any) {
    this.searchQuery = event.detail.value;
  }
}
