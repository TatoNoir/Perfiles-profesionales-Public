import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { IonContent, IonHeader, IonToolbar, IonTitle, IonButton } from '@ionic/angular/standalone';
import { AuthService } from '../../auth/services/auth.service';

@Component({
  selector: 'app-pro-layout',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet, IonContent, IonHeader, IonToolbar, IonTitle, IonButton],
  templateUrl: './pro-layout.component.html',
  styleUrl: './pro-layout.component.css'
})
export class ProLayoutComponent {
  constructor(private auth: AuthService) {}
  logout() { this.auth.logout(); }
}


