import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface ActivityCard {
  id: string;
  name: string;
  professionals: number;
  icon: string;
  color: string;
}

@Component({
  selector: 'app-activity-cards',
  imports: [CommonModule],
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
      color: '#FFD700'
    },
    {
      id: 'eventos',
      name: 'Eventos',
      professionals: 189,
      icon: '🎉',
      color: '#FF6B6B'
    },
    {
      id: 'gastronomia',
      name: 'Gastronomía',
      professionals: 156,
      icon: '👨‍🍳',
      color: '#4ECDC4'
    },
    {
      id: 'tecnologia',
      name: 'Tecnología',
      professionals: 312,
      icon: '💻',
      color: '#45B7D1'
    },
    {
      id: 'diseno',
      name: 'Diseño',
      professionals: 198,
      icon: '🎨',
      color: '#96CEB4'
    },
    {
      id: 'marketing',
      name: 'Marketing',
      professionals: 167,
      icon: '📱',
      color: '#FFEAA7'
    }
  ];

  onCardClick(activity: ActivityCard) {
    console.log('Categoría seleccionada:', activity.name);
    // Aquí implementaremos la navegación a la página de categoría
  }

  trackByActivityId(index: number, activity: ActivityCard): string {
    return activity.id;
  }
}
