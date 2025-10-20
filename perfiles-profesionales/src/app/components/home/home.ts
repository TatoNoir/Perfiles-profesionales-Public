import { Component } from '@angular/core';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { search, grid, star, location, checkmarkCircle } from 'ionicons/icons';
import { SearchBarComponent } from '../search-bar/search-bar';
import { ActivityCardsComponent } from '../activity-cards/activity-cards';
import { PopularSearchesComponent } from '../popular-searches/popular-searches';
import { ProfessionalCardsComponent } from '../professional-cards/professional-cards';
import { FooterComponent } from '../footer/footer';

@Component({
  selector: 'app-home',
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonCardContent,
    IonCardHeader, IonCardTitle, IonIcon,
    SearchBarComponent, ActivityCardsComponent, PopularSearchesComponent, ProfessionalCardsComponent, FooterComponent
  ],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class HomeComponent {
  constructor() {
    addIcons({ search, grid, star, location, checkmarkCircle });
  }
}
