import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonIcon, IonCard, IonCardContent, IonItem, IonLabel, IonInput, IonTextarea, IonSpinner } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { close, person, location, camera, checkmark, arrowBack } from 'ionicons/icons';
import { RegisterService, PersonalData, LocationData, ProfilePhoto, ProfessionalRegistration, ApiActivity, GeoState, GeoLocality, ZipCode } from './services/register.service';

@Component({
  selector: 'app-register-professional',
  imports: [CommonModule, FormsModule, IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonIcon, IonCard, IonCardContent, IonItem, IonLabel, IonInput, IonTextarea, IonSpinner],
  templateUrl: './register-professional.html',
  styleUrl: './register-professional.css'
})
export class RegisterProfessionalComponent implements OnInit {
  currentStep = 1;
  totalSteps = 3;
  isSubmitting = false;
  showSuccessMessage = false;

  // Form data
  personalData: PersonalData = {
    firstName: '',
    lastName: '',
    email: '',
    areaCode: '',
    phone: '',
    password: '',
    confirmPassword: '',
    activities: [],
    description: ''
  };

  locationData: LocationData = {
    street: '',
    streetNumber: '',
    floor: '',
    apartment: '',
    locality_id: 0,
    state_id: 0,
    zip_code_id: 0,
    workZone: ''
  };

  profilePhoto: ProfilePhoto = {
    profilePhoto: null
  };

  // Activities
  activities: ApiActivity[] = [];
  filteredActivities: ApiActivity[] = [];
  activitySearchTerm = '';
  showActivitiesDropdown = false;

  // Geographic data
  provinces: GeoState[] = [];
  filteredProvinces: GeoState[] = [];
  provinceSearchTerm = '';
  showProvincesDropdown = false;

  cities: GeoLocality[] = [];
  filteredCities: GeoLocality[] = [];
  citySearchTerm = '';
  showCitiesDropdown = false;

  // Zip codes
  zipCodes: ZipCode[] = [];
  filteredZipCodes: ZipCode[] = [];
  zipCodeSearchTerm = '';
  showZipCodesDropdown = false;

  constructor(
    private registerService: RegisterService,
    private router: Router
  ) {
    addIcons({ close, person, location, camera, checkmark, arrowBack });
  }

  ngOnInit() {
    // Cargar datos si existen en localStorage
    this.loadSavedData();
    // Cargar actividades
    this.loadActivities();
    // Cargar provincias
    this.loadProvinces();
  }

  // Navegación entre pasos
  nextStep() {
    if (this.validateCurrentStep()) {
      this.saveCurrentStepData();
      if (this.currentStep < this.totalSteps) {
        this.currentStep++;
      }
    }
  }

  previousStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  // Validación de pasos
  validateCurrentStep(): boolean {
    switch (this.currentStep) {
      case 1:
        return this.validatePersonalData();
      case 2:
        return this.validateLocationData();
      case 3:
        return this.validateProfilePhoto();
      default:
        return false;
    }
  }

  validatePersonalData(): boolean {
    return !!(
      this.personalData.firstName.trim() &&
      this.personalData.lastName.trim() &&
      this.personalData.email.trim() &&
      this.personalData.areaCode.trim() &&
      this.personalData.phone.trim() &&
      this.personalData.password.trim() &&
      this.personalData.confirmPassword.trim() &&
      this.personalData.activities.length > 0 &&
      this.personalData.description.trim() &&
      this.isValidEmail(this.personalData.email) &&
      this.passwordsMatch()
    );
  }

  validateLocationData(): boolean {
    return !!(
      this.locationData.street.trim() &&
      this.locationData.streetNumber.toString().trim() &&
      this.locationData.locality_id > 0 &&
      this.locationData.state_id > 0 &&
      this.locationData.zip_code_id > 0 &&
      this.locationData.workZone.trim()
    );
  }

  validateProfilePhoto(): boolean {
    return this.profilePhoto.profilePhoto !== null;
  }

  // Validación de email
  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Validación de contraseñas
  passwordsMatch(): boolean {
    return this.personalData.password === this.personalData.confirmPassword;
  }

  // Manejo de archivos
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      // Validar tipo de archivo
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        alert('Por favor selecciona un archivo JPG o PNG');
        return;
      }

      // Validar tamaño (5MB máximo)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        alert('El archivo debe ser menor a 5MB');
        return;
      }

      this.profilePhoto.profilePhoto = file;
    }
  }

  // Envío del formulario
  async submitRegistration() {
    if (!this.validateAllSteps()) {
      alert('Por favor completa todos los campos requeridos');
      return;
    }

    this.isSubmitting = true;

    try {
      const registrationData: ProfessionalRegistration = {
        ...this.personalData,
        ...this.locationData,
        ...this.profilePhoto
      };

      // Simular envío (cambiar por el servicio real)
      const result = await this.registerService.simulateRegistration(registrationData).toPromise();

      this.showSuccessMessage = true;
      this.clearSavedData();

      // Redirigir después de 3 segundos
      setTimeout(() => {
        this.router.navigate(['/professionals']);
      }, 3000);

    } catch (error) {
      console.error('Error al enviar registro:', error);
      alert('Error al enviar el registro. Inténtalo de nuevo.');
    } finally {
      this.isSubmitting = false;
    }
  }

  validateAllSteps(): boolean {
    return this.validatePersonalData() &&
           this.validateLocationData() &&
           this.validateProfilePhoto();
  }

  // Persistencia de datos
  saveCurrentStepData() {
    const data = {
      personalData: this.personalData,
      locationData: this.locationData,
      profilePhoto: this.profilePhoto,
      currentStep: this.currentStep
    };
    localStorage.setItem('professionalRegistration', JSON.stringify(data));
  }

  loadSavedData() {
    const savedData = localStorage.getItem('professionalRegistration');
    if (savedData) {
      try {
        const data = JSON.parse(savedData);
        this.personalData = data.personalData || this.personalData;
        this.locationData = data.locationData || this.locationData;
        this.profilePhoto = data.profilePhoto || this.profilePhoto;
        this.currentStep = data.currentStep || 1;
      } catch (error) {
        console.error('Error al cargar datos guardados:', error);
      }
    }
  }

  clearSavedData() {
    localStorage.removeItem('professionalRegistration');
  }

  // Cerrar modal
  closeModal() {
    this.router.navigate(['/professionals']);
  }

  // Getters para el template
  get stepTitle(): string {
    switch (this.currentStep) {
      case 1: return 'Datos Personales';
      case 2: return 'Ubicación';
      case 3: return 'Foto de Perfil';
      default: return '';
    }
  }

  get stepIcon(): string {
    switch (this.currentStep) {
      case 1: return 'person';
      case 2: return 'location';
      case 3: return 'camera';
      default: return '';
    }
  }

  get canGoNext(): boolean {
    return this.validateCurrentStep();
  }

  get canGoPrevious(): boolean {
    return this.currentStep > 1;
  }

  get isLastStep(): boolean {
    return this.currentStep === this.totalSteps;
  }

  get submitButtonText(): string {
    return this.isSubmitting ? 'Enviando...' : 'Finalizar Registro';
  }

  getPhotoPreview(): string {
    if (this.profilePhoto.profilePhoto) {
      return URL.createObjectURL(this.profilePhoto.profilePhoto);
    }
    return '';
  }

  // Métodos para manejar actividades
  loadActivities() {
    this.registerService.getActivities().subscribe({
      next: (activities) => {
        this.activities = activities;
        this.filteredActivities = activities;
      },
      error: (error) => {
        console.error('Error loading activities:', error);
        // Fallback: actividades por defecto
        this.activities = [
          { id: '1', name: 'Desarrollo Web', description: 'Desarrollo de sitios web y aplicaciones web' },
          { id: '2', name: 'Desarrollo Mobile', description: 'Desarrollo de aplicaciones móviles' },
          { id: '3', name: 'Diseño UX/UI', description: 'Diseño de experiencia de usuario e interfaz' },
          { id: '4', name: 'Marketing Digital', description: 'Estrategias de marketing digital' },
          { id: '5', name: 'Consultoría IT', description: 'Consultoría en tecnología' }
        ];
        this.filteredActivities = this.activities;
      }
    });
  }

  onActivitySearch(event: any) {
    this.activitySearchTerm = event.detail.value;
    this.filterActivities();
    this.showActivitiesDropdown = true;
  }

  onActivityFocus() {
    this.showActivitiesDropdown = true;
    this.filterActivities();
  }

  onActivityBlur() {
    // Delay para permitir clicks en los items
    setTimeout(() => {
      this.showActivitiesDropdown = false;
    }, 200);
  }

  filterActivities() {
    if (!this.activitySearchTerm.trim()) {
      this.filteredActivities = this.activities;
    } else {
      this.filteredActivities = this.activities.filter(activity =>
        activity.name.toLowerCase().includes(this.activitySearchTerm.toLowerCase()) ||
        (activity.description && activity.description.toLowerCase().includes(this.activitySearchTerm.toLowerCase()))
      );
    }
  }

  onActivitySelect(activity: ApiActivity) {
    if (!this.personalData.activities.includes(activity.id)) {
      this.personalData.activities.push(activity.id);
    }
    this.activitySearchTerm = '';
    this.filteredActivities = this.activities;
    this.showActivitiesDropdown = false;
  }

  removeActivity(activityId: string) {
    this.personalData.activities = this.personalData.activities.filter(id => id !== activityId);
  }

  getSelectedActivities(): ApiActivity[] {
    return this.activities.filter(activity => this.personalData.activities.includes(activity.id));
  }

  isActivitySelected(activityId: string): boolean {
    return this.personalData.activities.includes(activityId);
  }

  // Métodos para manejar provincias
  loadProvinces() {
    this.registerService.getProvincesByCountry(13).subscribe({
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
    this.locationData.state_id = province.id;
    this.provinceSearchTerm = province.name;
    this.showProvincesDropdown = false;
    // Cargar ciudades de la provincia seleccionada
    this.loadCities(province.id);
  }


  // Métodos para manejar ciudades
  loadCities(stateId: number) {
    this.registerService.getLocalitiesByState(stateId).subscribe({
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
    this.showCitiesDropdown = true;
    this.filterCities();
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
    this.locationData.locality_id = city.id;
    this.citySearchTerm = city.name;
    this.showCitiesDropdown = false;
    // Cargar zip codes de la ciudad seleccionada
    this.loadZipCodes(city);
  }


  // Métodos para manejar zip codes
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
    this.showZipCodesDropdown = true;
    this.filterZipCodes();
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
    this.locationData.zip_code_id = zipCode.id;
    this.zipCodeSearchTerm = `${zipCode.name} (${zipCode.code})`;
    this.showZipCodesDropdown = false;
  }

}
