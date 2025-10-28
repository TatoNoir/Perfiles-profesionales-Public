import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonSelect, IonSelectOption } from '@ionic/angular/standalone';
import { ProfessionalsListService } from '../../pages/professionals/services/professionals-list.service';
import { SharedDataService, ApiActivity, GeoState, GeoLocality } from '../../services/shared-data.service';

@Component({
  selector: 'app-filters-sidebar',
  imports: [CommonModule, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonSelect, IonSelectOption],
  templateUrl: './filters-sidebar.html',
  styleUrl: './filters-sidebar.css'
})
export class FiltersSidebarComponent implements OnInit, OnDestroy {
  @Output() activitySelected = new EventEmitter<string>();

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

  onActivityChange(activity: string) {
    this.selectedActivity = activity;
    // Emitir evento al componente padre para hacer búsqueda real en backend
    this.activitySelected.emit(activity);
  }

  onActivitySearch(event: any) {
    this.activitySearchTerm = event.target.value;
    this.filterActivities();
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
    }

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
    this.professionalsListService.setLocationFilter(city);
  }
}
