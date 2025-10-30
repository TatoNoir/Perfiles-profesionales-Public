import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonGrid, IonRow, IonCol, IonCard, IonCardContent, IonIcon, IonButton, IonList, IonItem, IonLabel, IonContent } from '@ionic/angular/standalone';
import { RouterModule } from '@angular/router';
import { addIcons } from 'ionicons';
import { star, starOutline, chatbubbles, personCircle, trendingUp, map } from 'ionicons/icons';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [CommonModule, RouterModule, IonContent, IonGrid, IonRow, IonCol, IonCard, IonCardContent, IonIcon, IonButton, IonList, IonItem, IonLabel],
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

  lastReviews = [
    { id: 1, user: 'Juan P.', rating: 5, comment: 'Excelente trabajo y muy profesional.' },
    { id: 2, user: 'María G.', rating: 4, comment: 'Muy buena atención.' },
    { id: 3, user: 'Carlos R.', rating: 5, comment: 'Rápido y eficaz.' },
    { id: 4, user: 'Lucía S.', rating: 3, comment: 'Podría mejorar en tiempos.' },
    { id: 5, user: 'Ana D.', rating: 4, comment: 'Quedé conforme con el resultado.' }
  ];

  lastQuestions = [
    { id: 101, user: 'Pedro', text: '¿Cuánto tarda el servicio estándar?' },
    { id: 102, user: 'Sofía', text: '¿Trabajás fines de semana?' },
    { id: 103, user: 'Martín', text: '¿Emitís factura?' },
    { id: 104, user: 'Laura', text: '¿Zona de cobertura?' },
    { id: 105, user: 'Elena', text: '¿Métodos de pago aceptados?' }
  ];

  constructor() {
    addIcons({ star, starOutline, chatbubbles, personCircle, trendingUp, map });
  }
}


