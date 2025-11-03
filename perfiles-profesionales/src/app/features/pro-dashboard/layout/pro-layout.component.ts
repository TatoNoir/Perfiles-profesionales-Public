import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IonContent, IonHeader, IonToolbar, IonTitle, IonButton, IonButtons, IonIcon, IonMenu, IonList, IonItem, IonLabel, IonSplitPane, IonMenuButton, IonRouterOutlet } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { home, personCircle, star, chatbubbles, logOut, map } from 'ionicons/icons';
import { AuthService } from '../../../core/auth/services/auth.service';

@Component({
  selector: 'app-pro-layout',
  standalone: true,
  imports: [
    CommonModule, RouterLink,
    IonContent, IonHeader, IonToolbar, IonTitle, IonButton, IonButtons, IonIcon,
    IonMenu, IonList, IonItem, IonLabel, IonSplitPane, IonMenuButton, IonRouterOutlet
  ],
  templateUrl: './pro-layout.component.html',
  styleUrl: './pro-layout.component.css'
})
export class ProLayoutComponent {
  constructor(private auth: AuthService) {
    addIcons({ home, personCircle, star, chatbubbles, logOut, map });
  }
  logout() { this.auth.logout(); }
}


