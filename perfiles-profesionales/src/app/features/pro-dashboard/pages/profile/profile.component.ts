import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonGrid, IonRow, IonCol, IonItem, IonLabel, IonInput, IonSelect, IonSelectOption, IonTextarea, IonChip, IonButton, IonIcon, IonSpinner, IonToast } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { save, create, close, camera } from 'ionicons/icons';
import { ProfileService, ProfessionalProfile, UpdateProfileRequest } from '../../services/profile.service';
import { SharedDataService, GeoState, GeoLocality } from '../../../../shared/services/shared-data.service';
import { ProfilePhotoThumbnailComponent } from '../../../../shared/components/cards/profile-photo-thumbnail/profile-photo-thumbnail';
import { ImageEditorComponent } from '../../../../shared/components/ui/image-editor/image-editor';
import { ImageService } from '../../../../shared/services/image.service';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [CommonModule, FormsModule, IonContent, IonGrid, IonRow, IonCol, IonItem, IonLabel, IonInput, IonSelect, IonSelectOption, IonTextarea, IonChip, IonButton, IonIcon, IonSpinner, IonToast, ProfilePhotoThumbnailComponent, ImageEditorComponent],
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

  // Foto de perfil
  isPhotoEditorOpen = false;
  tempImageFile: File | null = null;

  constructor(
    private profileService: ProfileService,
    private sharedDataService: SharedDataService,
    private imageService: ImageService
  ) {
    addIcons({ save, create, close, camera });
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

    // Preparar datos para el endpoint
    const updateData: UpdateProfileRequest = {
      username: this.profile.username || '',
      first_name: this.profile.first_name || '',
      last_name: this.profile.last_name || '',
      document_type: this.profile.document_type || '',
      document_number: this.profile.document_number || '',
      birth_date: this.profile.birth_date || '',
      nationality: this.profile.nationality || '',
      country_phone: this.profile.country_phone || '',
      area_code: this.profile.area_code || '',
      phone_number: this.profile.phone_number || '',
      email: this.profile.email || '',
      description: this.profile.description || '',
      address: this.profile.address || '',
      street: this.profile.street || '',
      street_number: this.profile.street_number || '',
      floor: this.profile.floor || '',
      apartment: this.profile.apartment || '',
      locality_id: this.profile.locality_id || 0,
      activities: this.profile.activities ? this.profile.activities.map(a => a.id) : []
    };

    this.profileService.updateProfile(updateData).subscribe({
      next: (updatedProfile) => {
        this.profile = updatedProfile;
        this.originalProfile = JSON.parse(JSON.stringify(updatedProfile));

        // Actualizar provincia y localidad seleccionadas
        if (updatedProfile.locality_id && updatedProfile.locality?.state_id) {
          this.selectedProvinceId = updatedProfile.locality.state_id;
          this.selectedLocalityId = updatedProfile.locality_id;
          this.loadLocalitiesByProvince(updatedProfile.locality.state_id);
        }

        this.editMode = false;
        this.savingProfile = false;
        this.showSuccessToast('Perfil actualizado correctamente');
      },
      error: (error) => {
        console.error('Error al actualizar el perfil:', error);
        this.savingProfile = false;
        this.showErrorToast('Error al actualizar el perfil. Por favor, intenta nuevamente.');
      }
    });
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

  // Helpers foto de perfil
  get profilePhotoUrl(): string | null {
    if (!this.profile || !this.profile.profile_picture) return null;
    return this.imageService.getProfileImageUrl(this.profile.profile_picture);
  }

  openPhotoEditor() {
    this.isPhotoEditorOpen = true;
  }

  onFileSelected(event: any) {
    const file: File | null = event?.target?.files?.[0] || null;
    if (file) {
      this.tempImageFile = file;
      this.isPhotoEditorOpen = true;
    }
  }

  onImageEdited(file: File) {
    if (!file) return;
    this.savingProfile = true;
    this.profileService.updateProfilePicture(file).subscribe({
      next: (resp) => {
        if (this.profile) {
          // Actualizar la url de la foto en memoria
          this.profile.profile_picture = resp.photo_url;
        }
        this.savingProfile = false;
        this.isPhotoEditorOpen = false;
        this.tempImageFile = null;
        this.showSuccessToast('Foto actualizada correctamente');
      },
      error: () => {
        this.savingProfile = false;
        this.isPhotoEditorOpen = false;
        this.tempImageFile = null;
        this.showErrorToast('Error al actualizar la foto');
      }
    });
  }

  onEditorClosed() {
    this.isPhotoEditorOpen = false;
    this.tempImageFile = null;
  }
}


