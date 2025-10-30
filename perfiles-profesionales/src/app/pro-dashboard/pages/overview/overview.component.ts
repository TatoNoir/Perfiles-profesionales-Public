import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonGrid, IonRow, IonCol, IonCard, IonCardContent, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { star, chatbubbles, personCircle, trendingUp } from 'ionicons/icons';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [CommonModule, IonGrid, IonRow, IonCol, IonCard, IonCardContent, IonIcon],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.css'
})
export class OverviewComponent {
  stats = {
    averageRating: 4.6,
    totalReviews: 23,
    pendingQuestions: 5,
    profileCompletion: 80
  };

  constructor() {
    addIcons({ star, chatbubbles, personCircle, trendingUp });
  }
}


