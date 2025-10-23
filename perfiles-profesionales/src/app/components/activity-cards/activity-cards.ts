import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonCard, IonCardContent, IonGrid, IonRow, IonCol, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { construct, calendar, restaurant, laptop, brush, phonePortrait } from 'ionicons/icons';

interface ActivityCard {
  id: string;
  name: string;
  professionals: number;
  icon: string;
  color: string;
  ionIcon?: string;
}

@Component({
  selector: 'app-activity-cards',
  imports: [CommonModule, IonCard, IonCardContent, IonGrid, IonRow, IonCol, IonIcon],
  templateUrl: './activity-cards.html',
  styleUrl: './activity-cards.css'
})
export class ActivityCardsComponent {
  activities: ActivityCard[] = [
    {
      id: 'construccion',
      name: 'Construcción',
      professionals: 234,
      icon: '🏗️',
      color: '#FFD700',
      ionIcon: 'construct'
    },
    {
      id: 'eventos',
      name: 'Eventos',
      professionals: 189,
      icon: '🎉',
      color: '#FF6B6B',
      ionIcon: 'calendar'
    },
    {
      id: 'gastronomia',
      name: 'Gastronomía',
      professionals: 156,
      icon: '👨‍🍳',
      color: '#4ECDC4',
      ionIcon: 'restaurant'
    },
    {
      id: 'tecnologia',
      name: 'Tecnología',
      professionals: 312,
      icon: '💻',
      color: '#45B7D1',
      ionIcon: 'laptop'
    },
    {
      id: 'diseno',
      name: 'Diseño',
      professionals: 198,
      icon: '🎨',
      color: '#96CEB4',
      ionIcon: 'brush'
    },
    {
      id: 'marketing',
      name: 'Marketing',
      professionals: 167,
      icon: '📱',
      color: '#FFEAA7',
      ionIcon: 'phone-portrait'
    }
  ];

  constructor() {
    addIcons({ construct, calendar, restaurant, laptop, brush, phonePortrait });
  }

  onCardClick(activity: ActivityCard) {
    // Aquí implementaremos la navegación a la página de categoría
  }

  trackByActivityId(index: number, activity: ActivityCard): string {
    return activity.id;
  }
}
