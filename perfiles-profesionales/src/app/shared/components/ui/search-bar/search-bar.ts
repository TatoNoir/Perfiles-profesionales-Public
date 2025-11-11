import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonSearchbar, IonButton, IonIcon, IonItem, IonSelect, IonSelectOption } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { search } from 'ionicons/icons';
import { ApiService } from '../../../../core/services/api.service';
import { DataMapperService } from '../../../services/data-mapper.service';
import { ApiProfessionalsResponse } from '../../../interfaces/api-response.interface';
import { ProfessionalBasic } from '../../../../features/professionals/pages/professionals-list/services/professionals-list.service';
import { SharedDataService, GeoState, GeoLocality } from '../../../services/shared-data.service';

@Component({
  selector: 'app-search-bar',
  imports: [CommonModule, FormsModule, IonSearchbar, IonButton, IonIcon, IonItem, IonSelect, IonSelectOption],
  templateUrl: './search-bar.html',
  styleUrl: './search-bar.css'
})
export class SearchBarComponent implements OnInit {
  searchQuery = '';
  isLoading = false;

  // Filtros de ubicación
  provinces: GeoState[] = [];
  selectedProvince: number | null = null;
  cities: GeoLocality[] = [];
  selectedCity: number | null = null;

  constructor(
    private router: Router,
    private apiService: ApiService,
    private dataMapper: DataMapperService,
    private sharedDataService: SharedDataService
  ) {
    addIcons({ search });
  }

  ngOnInit() {
    this.loadProvinces();
  }

  loadProvinces() {
    this.sharedDataService.getProvincesByCountry(13).subscribe({
      next: (provinces) => {
        this.provinces = provinces;
      },
      error: (error) => {
        console.error('Error loading provinces:', error);
      }
    });
  }

  onProvinceChange(event: any) {
    const provinceId = event.detail.value;
    this.selectedProvince = provinceId && provinceId !== 'all' ? parseInt(provinceId) : null;
    this.selectedCity = null;
    this.cities = [];

    if (this.selectedProvince) {
      this.sharedDataService.getLocalitiesByState(this.selectedProvince).subscribe({
        next: (cities) => {
          this.cities = cities;
        },
        error: (error) => {
          console.error('Error loading cities:', error);
        }
      });
    }
  }

  onCityChange(event: any) {
    const cityId = event.detail.value;
    this.selectedCity = cityId && cityId !== 'all' ? parseInt(cityId) : null;
  }

  onSearch() {
    // Permitir búsqueda si hay texto O si hay filtros de ubicación
    if (this.searchQuery.trim() || this.selectedProvince || this.selectedCity) {
      this.isLoading = true;

      // Llamar al endpoint del backend
      let params = this.apiService.createParams({
        page: '1',
        limit: '6'
      });

      // Agregar search solo si hay texto
      if (this.searchQuery.trim()) {
        params = params.set('search', this.searchQuery.trim());
      }

      // Agregar state_id si está seleccionado
      if (this.selectedProvince) {
        params = params.set('state_id', this.selectedProvince.toString());
      }

      // Agregar locality_id si está seleccionado
      if (this.selectedCity) {
        params = params.set('locality_id', this.selectedCity.toString());
      }

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
    return !!(this.searchQuery.trim() || this.selectedProvince || this.selectedCity);
  }

  onSearchInput(event: any) {
    this.searchQuery = event.detail.value;
  }
}
