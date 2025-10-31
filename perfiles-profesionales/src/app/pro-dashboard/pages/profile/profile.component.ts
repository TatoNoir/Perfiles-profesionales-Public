import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonGrid, IonRow, IonCol, IonItem, IonLabel, IonInput, IonSelect, IonSelectOption, IonTextarea, IonChip, IonButton, IonIcon, IonSpinner, IonToast } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { save, create, close } from 'ionicons/icons';
import { ProfileService, ProfessionalProfile } from '../../services/profile.service';
import { SharedDataService, GeoState, GeoLocality } from '../../../services/shared-data.service';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [CommonModule, FormsModule, IonContent, IonGrid, IonRow, IonCol, IonItem, IonLabel, IonInput, IonSelect, IonSelectOption, IonTextarea, IonChip, IonButton, IonIcon, IonSpinner, IonToast],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  editMode = false;
  loadingProfile = false;
  savingProfile = false;

  profile: ProfessionalProfile | null = null;
  originalProfile: ProfessionalProfile | null = null;

  // Provincias y localidades
  provinces: GeoState[] = [];
  localities: GeoLocality[] = [];
  loadingLocalities = false;
  selectedProvinceId: number | null = null;
  selectedLocalityId: number | null = null;

  toastMessage = '';
  showToast = false;
  toastColor: 'success' | 'danger' = 'success';

  constructor(
    private profileService: ProfileService,
    private sharedDataService: SharedDataService
  ) {
    addIcons({ save, create, close });
  }

  ngOnInit() {
    this.loadProfile();
    this.loadProvinces();
  }

  private loadProfile() {
    this.loadingProfile = true;
    this.profileService.getProfile().subscribe({
      next: (profile) => {
        this.profile = profile;
        // Guardar una copia para poder revertir cambios
        this.originalProfile = JSON.parse(JSON.stringify(profile));

        // Cargar localidades de la provincia actual si existe
        if (profile.locality_id && profile.locality?.state_id) {
          this.selectedProvinceId = profile.locality.state_id;
          this.selectedLocalityId = profile.locality_id;
          this.loadLocalitiesByProvince(profile.locality.state_id);
        }

        this.loadingProfile = false;
      },
      error: (error) => {
        console.error('Error al cargar el perfil:', error);
        this.showErrorToast('Error al cargar el perfil');
        this.loadingProfile = false;
      }
    });
  }

  private loadProvinces() {
    this.sharedDataService.getProvincesByCountry(13).subscribe({
      next: (provinces) => {
        this.provinces = provinces;
      },
      error: (error) => {
        console.error('Error al cargar provincias:', error);
      }
    });
  }

  private loadLocalitiesByProvince(stateId: number) {
    if (!stateId) {
      this.localities = [];
      return;
    }

    this.loadingLocalities = true;
    this.sharedDataService.getLocalitiesByState(stateId).subscribe({
      next: (localities) => {
        this.localities = localities;
        this.loadingLocalities = false;
      },
      error: (error) => {
        console.error('Error al cargar localidades:', error);
        this.loadingLocalities = false;
      }
    });
  }

  onProvinceChange(event: any) {
    const provinceId = event.detail?.value ? parseInt(event.detail.value) : parseInt(event);

    if (!provinceId || isNaN(provinceId)) {
      this.selectedProvinceId = null;
      this.selectedLocalityId = null;
      this.localities = [];
      if (this.profile) {
        this.profile.locality_id = null as any;
      }
      return;
    }

    this.selectedProvinceId = provinceId;
    this.selectedLocalityId = null; // Reset localidad cuando cambia la provincia

    if (this.profile) {
      this.profile.locality_id = null as any;
    }

    // Cargar localidades de la provincia seleccionada
    this.loadLocalitiesByProvince(provinceId);
  }

  onLocalityChange(event: any) {
    const localityId = event.detail?.value ? parseInt(event.detail.value) : parseInt(event);

    if (!localityId || isNaN(localityId)) {
      this.selectedLocalityId = null;
      if (this.profile) {
        this.profile.locality_id = null as any;
      }
      return;
    }

    this.selectedLocalityId = localityId;
    if (this.profile) {
      this.profile.locality_id = localityId;
    }
  }

  toggleEdit(on?: boolean) {
    this.editMode = on != null ? on : !this.editMode;

    // Si se cancela la edición, restaurar el perfil original
    if (!this.editMode && this.originalProfile && this.profile) {
      this.profile = JSON.parse(JSON.stringify(this.originalProfile));

      // Restaurar provincia y localidad seleccionadas
      if (this.profile.locality_id && this.profile.locality?.state_id) {
        this.selectedProvinceId = this.profile.locality.state_id;
        this.selectedLocalityId = this.profile.locality_id;
        this.loadLocalitiesByProvince(this.profile.locality.state_id);
      } else {
        this.selectedProvinceId = null;
        this.selectedLocalityId = null;
        this.localities = [];
      }
    }
  }

  save() {
    if (!this.profile) {
      return;
    }

    this.savingProfile = true;
    // TODO: llamar endpoint de actualización
    console.log('Guardar perfil', this.profile);

    // Simular guardado (reemplazar con llamada real al API)
    setTimeout(() => {
      if (this.profile) {
        this.originalProfile = JSON.parse(JSON.stringify(this.profile));
      }
      this.editMode = false;
      this.savingProfile = false;
      this.showSuccessToast('Perfil actualizado correctamente');
    }, 1000);
  }

  getActivitiesDisplay(): string {
    if (!this.profile || !this.profile.activities || this.profile.activities.length === 0) {
      return 'Sin actividades';
    }
    return this.profile.activities.map(a => a.name).join(', ');
  }

  getFullAddress(): string {
    if (!this.profile) {
      return '';
    }
    const parts = [
      this.profile.street,
      this.profile.street_number,
      this.profile.floor ? `Piso ${this.profile.floor}` : null,
      this.profile.apartment ? `Depto ${this.profile.apartment}` : null
    ].filter(p => p);
    return parts.join(' ') || this.profile.address || '';
  }

  getLocationDisplay(): string {
    if (!this.profile || !this.profile.locality) {
      return 'Sin ubicación';
    }
    const parts = [
      this.profile.locality.name,
      this.profile.locality.state?.name,
      this.profile.zone
    ].filter(p => p);
    return parts.join(', ') || '';
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


