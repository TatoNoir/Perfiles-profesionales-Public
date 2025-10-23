import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonIcon, IonCard, IonCardContent, IonItem, IonLabel, IonInput, IonTextarea, IonSelect, IonSelectOption, IonSpinner } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { close, person, location, camera, checkmark, arrowBack } from 'ionicons/icons';
import { RegisterService, PersonalData, LocationData, ProfilePhoto, ProfessionalRegistration } from './services/register.service';

@Component({
  selector: 'app-register-professional',
  imports: [CommonModule, FormsModule, IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonIcon, IonCard, IonCardContent, IonItem, IonLabel, IonInput, IonTextarea, IonSelect, IonSelectOption, IonSpinner],
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
    specialty: '',
    description: ''
  };

  locationData: LocationData = {
    address: '',
    city: '',
    province: '',
    workZone: ''
  };

  profilePhoto: ProfilePhoto = {
    profilePhoto: null
  };

  // Options
  specialties: string[] = [
    'Desarrollo Web',
    'Desarrollo Mobile',
    'Diseño UX/UI',
    'Marketing Digital',
    'Consultoría IT',
    'Data Science',
    'DevOps',
    'Ciberseguridad',
    'Inteligencia Artificial',
    'Blockchain'
  ];

  provinces: string[] = [
    'Buenos Aires',
    'CABA',
    'Córdoba',
    'Santa Fe',
    'Mendoza',
    'Tucumán',
    'Entre Ríos',
    'Salta',
    'Misiones',
    'Chaco',
    'Corrientes',
    'Santiago del Estero',
    'San Juan',
    'Jujuy',
    'Río Negro',
    'Formosa',
    'Neuquén',
    'Chubut',
    'San Luis',
    'Catamarca',
    'La Rioja',
    'La Pampa',
    'Santa Cruz',
    'Tierra del Fuego'
  ];

  constructor(
    private registerService: RegisterService,
    private router: Router
  ) {
    addIcons({ close, person, location, camera, checkmark, arrowBack });
  }

  ngOnInit() {
    // Cargar datos si existen en localStorage
    this.loadSavedData();
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
      this.personalData.specialty.trim() &&
      this.personalData.description.trim() &&
      this.isValidEmail(this.personalData.email)
    );
  }

  validateLocationData(): boolean {
    return !!(
      this.locationData.address.trim() &&
      this.locationData.city.trim() &&
      this.locationData.province.trim() &&
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
}
