import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonIcon, IonButtons, IonButton } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { grid } from 'ionicons/icons';
import { SearchBarComponent } from '../../shared/components/ui/search-bar/search-bar';
import { ActivityCardsComponent } from '../../shared/components/cards/activity-cards/activity-cards';
import { ProfessionalCardsComponent } from '../../shared/components/cards/professional-cards/professional-cards';
import { FooterComponent } from '../../shared/components/layout/footer/footer';

@Component({
  selector: 'app-home',
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar, IonIcon, IonButtons, IonButton, RouterLink,
    SearchBarComponent, ActivityCardsComponent, ProfessionalCardsComponent, FooterComponent
  ],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class HomeComponent {
  constructor() {
    addIcons({ grid });
  }
}
