import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonGrid, IonRow, IonCol, IonCard, IonCardContent, IonIcon, IonButton, IonList, IonItem, IonLabel, IonContent, IonSpinner } from '@ionic/angular/standalone';
import { RouterModule } from '@angular/router';
import { addIcons } from 'ionicons';
import { star, starOutline, chatbubbles, trendingUp, map } from 'ionicons/icons';
import { AuthService } from '../../../auth/services/auth.service';
import { ReviewsService, Review } from '../../services/reviews.service';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [CommonModule, RouterModule, IonContent, IonGrid, IonRow, IonCol, IonCard, IonCardContent, IonIcon, IonButton, IonList, IonItem, IonLabel, IonSpinner],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.css'
})
export class OverviewComponent implements OnInit {
  stats = {
    averageRating: 0,
    totalReviews: 0,
    pendingQuestions: 0
  };

  lastReviews: Review[] = [];
  loadingReviews = false;

  lastQuestions = [
    { id: 101, user: 'Pedro', text: '¿Cuánto tarda el servicio estándar?' },
    { id: 102, user: 'Sofía', text: '¿Trabajás fines de semana?' },
    { id: 103, user: 'Martín', text: '¿Emitís factura?' },
    { id: 104, user: 'Laura', text: '¿Zona de cobertura?' },
    { id: 105, user: 'Elena', text: '¿Métodos de pago aceptados?' }
  ];

  constructor(
    private auth: AuthService,
    private reviewsService: ReviewsService
  ) {
    addIcons({ star, starOutline, chatbubbles, trendingUp, map });
  }

  ngOnInit() {
    this.loadUserStats();
    this.loadReviews();
  }

  private loadUserStats() {
    // Verificar si el AuthService tiene el método getUser()
    // Si no existe, usar el método alternativo
    try {
      const user = (this.auth as any).getUser?.();
      if (user) {
        this.stats.averageRating = user.rates_average ?? 0;
        this.stats.totalReviews = user.rates_count ?? 0;
        this.stats.pendingQuestions = user.unanswered_questions ?? 0;
      }
    } catch (error) {
      console.error('Error al cargar estadísticas del usuario:', error);
    }
  }

  private loadReviews() {
    this.loadingReviews = true;
    this.reviewsService.getOverviewReviews().subscribe({
      next: (reviews) => {
        this.lastReviews = reviews;
        this.loadingReviews = false;
      },
      error: (error) => {
        console.error('Error al cargar reviews:', error);
        this.loadingReviews = false;
      }
    });
  }

  getUserDisplayName(review: Review): string {
    return review.name || `${review.user.first_name} ${review.user.last_name}`.trim() || 'Usuario';
  }

  hasComment(review: Review): boolean {
    return !!review.comment && review.comment.trim().length > 0;
  }
}


