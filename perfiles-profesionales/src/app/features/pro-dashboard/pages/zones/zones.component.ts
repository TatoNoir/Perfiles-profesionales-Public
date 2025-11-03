import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonSpinner } from '@ionic/angular/standalone';
import { ProfileService, ProfessionalProfile } from '../../services/profile.service';

@Component({
  selector: 'app-zones-page',
  standalone: true,
  imports: [CommonModule, IonContent, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonSpinner],
  templateUrl: './zones.component.html',
  styleUrl: './zones.component.css'
})
export class ZonesComponent implements OnInit {
  profile: ProfessionalProfile | null = null;
  loadingProfile = false;

  constructor(private profileService: ProfileService) {}

  ngOnInit() {
    this.loadProfile();
  }

  private loadProfile() {
    this.loadingProfile = true;
    this.profileService.getProfile().subscribe({
      next: (profile) => {
        this.profile = profile;
        this.loadingProfile = false;
      },
      error: (error) => {
        console.error('Error al cargar el perfil:', error);
        this.loadingProfile = false;
      }
    });
  }

  get localityName(): string {
    return this.profile?.locality?.name || 'No especificada';
  }

  get provinceName(): string {
    return this.profile?.locality?.state?.name || 'No especificada';
  }
}

