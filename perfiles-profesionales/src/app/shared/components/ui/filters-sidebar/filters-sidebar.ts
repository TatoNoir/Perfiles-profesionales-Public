import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonSelect, IonSelectOption } from '@ionic/angular/standalone';
import { ProfessionalsListService } from '../../../../features/professionals/pages/professionals-list/services/professionals-list.service';
import { SharedDataService, ApiActivity, GeoState, GeoLocality } from '../../../services/shared-data.service';

@Component({
  selector: 'app-filters-sidebar',
  imports: [CommonModule, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonSelect, IonSelectOption],
  templateUrl: './filters-sidebar.html',
  styleUrl: './filters-sidebar.css'
})
export class FiltersSidebarComponent implements OnInit, OnDestroy {
  @Output() activitySelected = new EventEmitter<number | null>();
  @Output() provinceSelected = new EventEmitter<number | null>();
  @Output() citySelected = new EventEmitter<number | null>();
  // Actividades del backend
  activities: ApiActivity[] = [];
  filteredActivities: ApiActivity[] = [];
  selectedActivity = 'all';
  activitySearchTerm = '';

  // Provincias del backend
  provinces: GeoState[] = [];
  filteredProvinces: GeoState[] = [];
  selectedProvince = 'all';
  provinceSearchTerm = '';

  // Ciudades del backend
  cities: GeoLocality[] = [];
  filteredCities: GeoLocality[] = [];
  selectedCity = 'all';
  citySearchTerm = '';

  private subscription: Subscription = new Subscription();

  constructor(
    private professionalsListService: ProfessionalsListService,
    private sharedDataService: SharedDataService
  ) {}

  ngOnInit() {
    this.loadFilterOptions();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private loadFilterOptions() {
    // Cargar actividades del backend
    this.subscription.add(
      this.sharedDataService.getActivities().subscribe(activities => {
        this.activities = activities;
        this.filteredActivities = activities;
      })
    );

    // Cargar provincias del backend
    this.subscription.add(
      this.sharedDataService.getProvincesByCountry().subscribe(provinces => {
        this.provinces = provinces;
        this.filteredProvinces = provinces;
      })
    );
  }

  onActivityChange(activity: string | ApiActivity) {
    if (typeof activity === 'string') {
      // Si es 'all', emitir null
      this.selectedActivity = activity;
      this.activitySelected.emit(null);
    } else {
      // Si es un objeto ApiActivity, usar su id
      this.selectedActivity = activity.name;
      const activityId = parseInt(activity.id);
      this.activitySelected.emit(isNaN(activityId) ? null : activityId);
    }
  }

  onActivitySearch(event: any) {
    this.activitySearchTerm = event.target.value;
    this.filterActivities();
  }

  onActivitySelectChange(event: any) {
    const value = event.detail.value;
    if (value === 'all') {
      this.onActivityChange('all');
    } else {
      const activity = this.activities.find(a => a.name === value);
      if (activity) {
        this.onActivityChange(activity);
      }
    }
  }

  private filterActivities() {
    if (!this.activitySearchTerm.trim()) {
      this.filteredActivities = this.activities;
    } else {
      this.filteredActivities = this.activities.filter(activity =>
        activity.name.toLowerCase().includes(this.activitySearchTerm.toLowerCase()) ||
        (activity.description && activity.description.toLowerCase().includes(this.activitySearchTerm.toLowerCase()))
      );
    }
  }

  onProvinceSearch(event: any) {
    this.provinceSearchTerm = event.target.value;
    this.filterProvinces();
  }

  private filterProvinces() {
    if (!this.provinceSearchTerm.trim()) {
      this.filteredProvinces = this.provinces;
    } else {
      this.filteredProvinces = this.provinces.filter(province =>
        province.name.toLowerCase().includes(this.provinceSearchTerm.toLowerCase())
      );
    }
  }

  onProvinceChange(province: string) {
    this.selectedProvince = province;
    this.selectedCity = 'all'; // Reset city when province changes
    this.cities = []; // Clear cities
    this.filteredCities = []; // Clear filtered cities
    this.citySearchTerm = ''; // Clear city search

    if (province !== 'all') {
      const provinceId = parseInt(province);
      this.subscription.add(
        this.sharedDataService.getLocalitiesByState(provinceId).subscribe(cities => {
          this.cities = cities;
          this.filteredCities = cities;
        })
      );
      // Emitir el ID de la provincia al componente padre
      this.provinceSelected.emit(provinceId);
    } else {
      // Si es 'all', emitir null
      this.provinceSelected.emit(null);
    }

    // Mantener el filtro del lado del cliente por si acaso (opcional)
    this.professionalsListService.setLocationFilter(province);
  }

  onCitySearch(event: any) {
    this.citySearchTerm = event.target.value;
    this.filterCities();
  }

  private filterCities() {
    if (!this.citySearchTerm.trim()) {
      this.filteredCities = this.cities;
    } else {
      this.filteredCities = this.cities.filter(city =>
        city.name.toLowerCase().includes(this.citySearchTerm.toLowerCase())
      );
    }
  }

  onCityChange(city: string) {
    this.selectedCity = city;

    if (city !== 'all') {
      const cityId = parseInt(city);
      // Emitir el ID de la ciudad al componente padre
      this.citySelected.emit(cityId);
    } else {
      // Si es 'all', emitir null (usar solo el filtro de provincia)
      this.citySelected.emit(null);
    }

    // Mantener el filtro del lado del cliente por si acaso (opcional)
    this.professionalsListService.setLocationFilter(city);
  }

  // Método para resetear todos los filtros
  resetFilters() {
    this.selectedActivity = 'all';
    this.selectedProvince = 'all';
    this.selectedCity = 'all';
    this.cities = [];
    this.filteredCities = [];
    this.citySearchTerm = '';
    this.activitySearchTerm = '';
    this.provinceSearchTerm = '';
    this.filteredActivities = this.activities;
    this.filteredProvinces = this.provinces;
    
    // Emitir eventos para notificar al componente padre que los filtros se resetearon
    this.activitySelected.emit(null);
    this.provinceSelected.emit(null);
    this.citySelected.emit(null);
  }
}
