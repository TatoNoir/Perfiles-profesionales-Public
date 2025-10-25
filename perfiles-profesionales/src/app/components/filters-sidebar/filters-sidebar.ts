import { Component, OnInit, OnDestroy } from '@angular/core';
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
  // Actividades del backend
  activities: ApiActivity[] = [];
  filteredActivities: ApiActivity[] = [];
  selectedActivity = 'all';
  activitySearchTerm = '';

  // Provincias del backend
  provinces: GeoState[] = [];
  selectedProvince = 'all';

  // Ciudades del backend
  cities: GeoLocality[] = [];
  selectedCity = 'all';

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
      })
    );
  }

  onActivityChange(activity: string) {
    this.selectedActivity = activity;
    this.professionalsListService.setSpecialtyFilter(activity);
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

  onProvinceChange(province: string) {
    this.selectedProvince = province;
    this.selectedCity = 'all'; // Reset city when province changes
    this.cities = []; // Clear cities

    if (province !== 'all') {
      const provinceId = parseInt(province);
      this.subscription.add(
        this.sharedDataService.getLocalitiesByState(provinceId).subscribe(cities => {
          this.cities = cities;
        })
      );
    }

    this.professionalsListService.setLocationFilter(province);
  }

  onCityChange(city: string) {
    this.selectedCity = city;
    this.professionalsListService.setLocationFilter(city);
  }
}
