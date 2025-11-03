import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonGrid, IonRow, IonCol, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonIcon, IonButton, IonList, IonItem, IonLabel, IonContent, IonSpinner } from '@ionic/angular/standalone';
import { RouterModule } from '@angular/router';
import { addIcons } from 'ionicons';
import { star, starOutline, chatbubbles, trendingUp, map } from 'ionicons/icons';
import { AuthService } from '../../../../core/auth/services/auth.service';
import { ReviewsService, Review } from '../../services/reviews.service';
import { QuestionsService, Question } from '../../services/questions.service';
import { ImageService } from '../../../../shared/services/image.service';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [CommonModule, RouterModule, IonContent, IonGrid, IonRow, IonCol, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonIcon, IonButton, IonList, IonItem, IonLabel, IonSpinner],
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

  lastQuestions: Question[] = [];
  loadingQuestions = false;

  constructor(
    private auth: AuthService,
    private reviewsService: ReviewsService,
    private questionsService: QuestionsService,
    private imageService: ImageService
  ) {
    addIcons({ star, starOutline, chatbubbles, trendingUp, map });
  }

  // Datos de usuario actual
  get currentUser() {
    return this.auth.getUser();
  }

  get fullName(): string {
    const u: any = this.currentUser;
    return `${u?.first_name || ''} ${u?.last_name || ''}`.trim() || (u?.name || '');
  }

  get profilePhotoUrl(): string | null {
    const u: any = this.currentUser;
    if (!u?.profile_picture) return null;
    return this.imageService.getProfileImageUrl(u.profile_picture);
  }

  ngOnInit() {
    this.loadUserStats();
    this.loadReviews();
    this.loadQuestions();
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

  private loadQuestions() {
    this.loadingQuestions = true;
    this.questionsService.getOverviewQuestions().subscribe({
      next: (questions) => {
        this.lastQuestions = questions;
        this.loadingQuestions = false;
      },
      error: (error) => {
        console.error('Error al cargar preguntas:', error);
        this.loadingQuestions = false;
      }
    });
  }

  getQuestionDisplayName(question: Question): string {
    return question.name || `${question.user.first_name} ${question.user.last_name}`.trim() || 'Usuario';
  }
}


