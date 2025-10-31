import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonGrid, IonRow, IonCol, IonItem, IonLabel, IonInput, IonSelect, IonSelectOption, IonTextarea, IonChip, IonButton, IonIcon, IonSpinner, IonToast } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { save, create, close } from 'ionicons/icons';
import { ProfileService, ProfessionalProfile } from '../../services/profile.service';

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

  toastMessage = '';
  showToast = false;
  toastColor: 'success' | 'danger' = 'success';

  constructor(private profileService: ProfileService) {
    addIcons({ save, create, close });
  }

  ngOnInit() {
    this.loadProfile();
  }

  private loadProfile() {
    this.loadingProfile = true;
    this.profileService.getProfile().subscribe({
      next: (profile) => {
        this.profile = profile;
        // Guardar una copia para poder revertir cambios
        this.originalProfile = JSON.parse(JSON.stringify(profile));
        this.loadingProfile = false;
      },
      error: (error) => {
        console.error('Error al cargar el perfil:', error);
        this.showErrorToast('Error al cargar el perfil');
        this.loadingProfile = false;
      }
    });
  }

  toggleEdit(on?: boolean) {
    this.editMode = on != null ? on : !this.editMode;

    // Si se cancela la edición, restaurar el perfil original
    if (!this.editMode && this.originalProfile && this.profile) {
      this.profile = JSON.parse(JSON.stringify(this.originalProfile));
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


