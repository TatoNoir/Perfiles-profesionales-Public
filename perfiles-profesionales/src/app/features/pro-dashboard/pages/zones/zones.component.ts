import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonSpinner, IonItem, IonLabel, IonInput, IonButton, IonToast } from '@ionic/angular/standalone';
import { ProfileService, ProfessionalProfile, UpdateProfileRequest } from '../../services/profile.service';
import { SharedDataService, GeoState, GeoLocality, ZipCode } from '../../../../shared/services/shared-data.service';

@Component({
  selector: 'app-zones-page',
  standalone: true,
  imports: [CommonModule, FormsModule, IonContent, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonSpinner, IonItem, IonLabel, IonInput, IonButton, IonToast],
  templateUrl: './zones.component.html',
  styleUrl: './zones.component.css'
})
export class ZonesComponent implements OnInit {
  profile: ProfessionalProfile | null = null;
  loadingProfile = false;
  updatingLocation = false;
  
  toastMessage = '';
  showToast = false;
  toastColor: 'success' | 'danger' = 'success';

  // Geographic data (solo informativo)
  provinces: GeoState[] = [];
  filteredProvinces: GeoState[] = [];
  provinceSearchTerm = '';
  showProvincesDropdown = false;
  selectedProvince: GeoState | null = null;

  cities: GeoLocality[] = [];
  filteredCities: GeoLocality[] = [];
  citySearchTerm = '';
  showCitiesDropdown = false;
  selectedCity: GeoLocality | null = null;

  zipCodes: ZipCode[] = [];
  filteredZipCodes: ZipCode[] = [];
  zipCodeSearchTerm = '';
  showZipCodesDropdown = false;
  selectedZipCode: ZipCode | null = null;

  constructor(
    private profileService: ProfileService,
    private sharedDataService: SharedDataService
  ) {}

  ngOnInit() {
    this.loadProfile();
    this.loadProvinces();
  }

  private loadProfile() {
    this.loadingProfile = true;
    this.profileService.getProfile().subscribe({
      next: (profile) => {
        this.profile = profile;
        this.loadingProfile = false;
        // No pre-seleccionamos valores, los desplegables quedan vacíos para explorar
      },
      error: (error) => {
        console.error('Error al cargar el perfil:', error);
        this.loadingProfile = false;
      }
    });
  }

  // Métodos para provincias
  loadProvinces() {
    this.sharedDataService.getProvincesByCountry(13).subscribe({
      next: (provinces) => {
        this.provinces = provinces;
        this.filteredProvinces = provinces;
      },
      error: (error) => {
        console.error('Error loading provinces:', error);
      }
    });
  }

  onProvinceSearch(event: any) {
    this.provinceSearchTerm = event.detail.value;
    this.filterProvinces();
    this.showProvincesDropdown = true;
  }

  onProvinceFocus() {
    this.showProvincesDropdown = true;
    this.filterProvinces();
  }

  onProvinceBlur() {
    setTimeout(() => {
      this.showProvincesDropdown = false;
    }, 200);
  }

  filterProvinces() {
    if (!this.provinceSearchTerm.trim()) {
      this.filteredProvinces = this.provinces;
    } else {
      this.filteredProvinces = this.provinces.filter(province =>
        province.name.toLowerCase().includes(this.provinceSearchTerm.toLowerCase())
      );
    }
  }

  onProvinceSelect(province: GeoState) {
    this.selectedProvince = province;
    this.provinceSearchTerm = province.name;
    this.showProvincesDropdown = false;
    // Limpiar selecciones dependientes
    this.selectedCity = null;
    this.citySearchTerm = '';
    this.cities = [];
    this.filteredCities = [];
    this.selectedZipCode = null;
    this.zipCodeSearchTerm = '';
    this.zipCodes = [];
    this.filteredZipCodes = [];
    // Cargar ciudades
    this.loadCities(province.id);
  }

  // Métodos para ciudades
  loadCities(stateId: number) {
    this.sharedDataService.getLocalitiesByState(stateId).subscribe({
      next: (cities) => {
        this.cities = cities;
        this.filteredCities = cities;
      },
      error: (error) => {
        console.error('Error loading cities:', error);
      }
    });
  }

  onCitySearch(event: any) {
    this.citySearchTerm = event.detail.value;
    this.filterCities();
    this.showCitiesDropdown = true;
  }

  onCityFocus() {
    if (this.selectedProvince) {
      this.showCitiesDropdown = true;
      this.filterCities();
    }
  }

  onCityBlur() {
    setTimeout(() => {
      this.showCitiesDropdown = false;
    }, 200);
  }

  filterCities() {
    if (!this.citySearchTerm.trim()) {
      this.filteredCities = this.cities;
    } else {
      this.filteredCities = this.cities.filter(city =>
        city.name.toLowerCase().includes(this.citySearchTerm.toLowerCase())
      );
    }
  }

  onCitySelect(city: GeoLocality) {
    this.selectedCity = city;
    this.citySearchTerm = city.name;
    this.showCitiesDropdown = false;
    // Limpiar código postal
    this.selectedZipCode = null;
    this.zipCodeSearchTerm = '';
    // Cargar códigos postales
    this.loadZipCodes(city);
  }

  // Métodos para códigos postales
  loadZipCodes(city: GeoLocality) {
    this.zipCodes = city.zip_codes || [];
    this.filteredZipCodes = this.zipCodes;
  }

  onZipCodeSearch(event: any) {
    this.zipCodeSearchTerm = event.detail.value;
    this.filterZipCodes();
    this.showZipCodesDropdown = true;
  }

  onZipCodeFocus() {
    if (this.selectedCity) {
      this.showZipCodesDropdown = true;
      this.filterZipCodes();
    }
  }

  onZipCodeBlur() {
    setTimeout(() => {
      this.showZipCodesDropdown = false;
    }, 200);
  }

  filterZipCodes() {
    if (!this.zipCodeSearchTerm.trim()) {
      this.filteredZipCodes = this.zipCodes;
    } else {
      this.filteredZipCodes = this.zipCodes.filter(zipCode =>
        zipCode.name.toLowerCase().includes(this.zipCodeSearchTerm.toLowerCase()) ||
        zipCode.code.toLowerCase().includes(this.zipCodeSearchTerm.toLowerCase())
      );
    }
  }

  onZipCodeSelect(zipCode: ZipCode) {
    this.selectedZipCode = zipCode;
    this.zipCodeSearchTerm = `${zipCode.name} (${zipCode.code})`;
    this.showZipCodesDropdown = false;
  }

  get localityName(): string {
    return this.profile?.locality?.name || 'No especificada';
  }

  get provinceName(): string {
    return this.profile?.locality?.state?.name || 'No especificada';
  }

  // Método para cambiar la ubicación
  onChangeLocation() {
    if (!this.selectedCity || !this.profile) {
      this.showErrorToast('Por favor, selecciona una localidad');
      return;
    }

    this.updatingLocation = true;

    // Preparar los datos del perfil con el nuevo locality_id
    const updateData: UpdateProfileRequest = {
      username: this.profile.username,
      first_name: this.profile.first_name,
      last_name: this.profile.last_name,
      document_type: this.profile.document_type,
      document_number: this.profile.document_number,
      birth_date: this.profile.birth_date,
      nationality: this.profile.nationality,
      country_phone: this.profile.country_phone,
      area_code: this.profile.area_code,
      phone_number: this.profile.phone_number,
      email: this.profile.email,
      description: this.profile.description,
      address: this.profile.address,
      street: this.profile.street,
      street_number: this.profile.street_number,
      floor: this.profile.floor,
      apartment: this.profile.apartment,
      locality_id: this.selectedCity.id, // Solo cambiamos el locality_id
      activities: this.profile.activities.map(activity => activity.id)
    };

    this.profileService.updateProfile(updateData).subscribe({
      next: (updatedProfile) => {
        this.profile = updatedProfile;
        this.updatingLocation = false;
        this.showSuccessToast('Ubicación actualizada correctamente');
        // Limpiar selecciones después de actualizar
        this.selectedProvince = null;
        this.provinceSearchTerm = '';
        this.selectedCity = null;
        this.citySearchTerm = '';
        this.selectedZipCode = null;
        this.zipCodeSearchTerm = '';
        this.cities = [];
        this.filteredCities = [];
        this.zipCodes = [];
        this.filteredZipCodes = [];
      },
      error: (error) => {
        console.error('Error al actualizar la ubicación:', error);
        this.updatingLocation = false;
        this.showErrorToast('Error al actualizar la ubicación. Por favor, intenta nuevamente.');
      }
    });
  }

  private showSuccessToast(message: string) {
    this.toastMessage = message;
    this.toastColor = 'success';
    this.showToast = true;
  }

  private showErrorToast(message: string) {
    this.toastMessage = message;
    this.toastColor = 'danger';
    this.showToast = true;
  }
}

