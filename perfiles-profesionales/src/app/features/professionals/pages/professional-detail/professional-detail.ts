import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonIcon, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonChip, IonSpinner } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowBack, checkmarkCircle, star, starHalf, starOutline, location, mail, briefcase, chatbubbleOutline } from 'ionicons/icons';
import { ProfessionalDetailService, ProfessionalDetail } from './services/professional-detail.service';
import { ProfessionalBasic } from '../professionals-list/services/professionals-list.service';
import { Review } from '../../../../shared/interfaces/api-response.interface';

// Tipo combinado que incluye tanto datos básicos como detallados
type ProfessionalFull = ProfessionalBasic & ProfessionalDetail;
import { ContactModalComponent } from '../../../../shared/components/modals/contact-modal/contact-modal';
import { ReviewModalComponent, ReviewForm } from '../../../../shared/components/modals/review-modal/review-modal';
import { QuestionModalComponent, QuestionForm } from '../../../../shared/components/modals/question-modal/question-modal';
import { ProfilePhotoThumbnailComponent } from '../../../../shared/components/cards/profile-photo-thumbnail/profile-photo-thumbnail';
import { ViewReviewsModalComponent } from '../../../../shared/components/modals/view-reviews-modal/view-reviews-modal';
import { ViewQuestionsModalComponent } from '../../../../shared/components/modals/view-questions-modal/view-questions-modal';

@Component({
  selector: 'app-professional-detail',
  imports: [CommonModule, IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonIcon, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonChip, IonSpinner, ContactModalComponent, ReviewModalComponent, QuestionModalComponent, ProfilePhotoThumbnailComponent, ViewReviewsModalComponent, ViewQuestionsModalComponent],
  templateUrl: './professional-detail.html',
  styleUrl: './professional-detail.css'
})
export class ProfessionalDetailComponent implements OnInit, OnDestroy {
  professional: ProfessionalFull | null = null;
  isContactModalOpen = false;
  isReviewModalOpen = false;
  isQuestionModalOpen = false;
  isViewReviewsModalOpen = false;
  isViewQuestionsModalOpen = false;
  private subscription: Subscription = new Subscription();

  // Reviews properties
  professionalReviews: Review[] = [];
  averageRating = 0;
  reviewsCount = 0;

  // Questions properties
  professionalQuestions: any[] = [];
  displayedQuestions: any[] = [];
  questionsCount = 0;

  // Expose Math to template
  Math = Math;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private professionalDetailService: ProfessionalDetailService
  ) {
    addIcons({ arrowBack, checkmarkCircle, star, starHalf, starOutline, location, mail, briefcase, chatbubbleOutline });
  }

  ngOnInit() {
    this.subscription = this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.loadProfessional(id);
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

      private loadProfessional(id: string) {
        // Cargar datos detallados del profesional
        this.subscription.add(
          this.professionalDetailService.getProfessionalDetail(id).subscribe(detailData => {
            if (detailData) {
              // Los datos detallados ya incluyen toda la información necesaria
              this.professional = detailData as ProfessionalFull;

              // Cargar reviews del profesional
              this.loadReviews();

              // Cargar preguntas del profesional
              this.loadQuestions();
            } else {
              this.professional = null;
            }
          })
        );
      }

      private loadReviews() {
        if (this.professional && (this.professional as any).reviewsList) {
          this.professionalReviews = (this.professional as any).reviewsList;
          this.calculateRatingStats();
        }
      }

      private loadQuestions() {
        if (this.professional && (this.professional as any).questions) {
          // Filtrar solo las preguntas publicadas (published: true)
          const allQuestions = (this.professional as any).questions;
          this.professionalQuestions = allQuestions.filter((question: any) => question.published === true);
          this.questionsCount = this.professionalQuestions.length;
          // Mostrar solo las primeras 2 preguntas publicadas
          this.displayedQuestions = this.professionalQuestions.slice(0, 2);
        }
      }

      private calculateRatingStats() {
        if (this.professionalReviews.length === 0) {
          this.averageRating = 0;
          this.reviewsCount = 0;
          return;
        }

        const totalRating = this.professionalReviews.reduce((sum, review) => sum + review.value, 0);
        this.averageRating = totalRating / this.professionalReviews.length;
        this.reviewsCount = this.professionalReviews.length;
      }

      get hasReviews(): boolean {
        return this.professionalReviews.length > 0;
      }

      get hasQuestions(): boolean {
        return this.professionalQuestions.length > 0;
      }

  goBack() {
    this.router.navigate(['/professionals']);
  }

  contactProfessional() {
    this.isContactModalOpen = true;
  }

  onCloseContactModal() {
    this.isContactModalOpen = false;
  }

  onLeaveReview() {
    this.isReviewModalOpen = true;
  }

  onCloseReviewModal() {
    this.isReviewModalOpen = false;
  }

  onSubmitReview(reviewForm: ReviewForm) {
    // Aquí implementaremos la lógica para guardar la reseña
    // Por ahora solo mostramos un mensaje de confirmación
    alert('¡Reseña enviada exitosamente!');
  }

  onAskQuestion() {
    this.isQuestionModalOpen = true;
  }

  onCloseQuestionModal() {
    this.isQuestionModalOpen = false;
  }

  onViewReviews() {
    this.isViewReviewsModalOpen = true;
  }

  onCloseViewReviewsModal() {
    this.isViewReviewsModalOpen = false;
  }

  onViewQuestions() {
    this.isViewQuestionsModalOpen = true;
  }

  onCloseViewQuestionsModal() {
    this.isViewQuestionsModalOpen = false;
  }

  onSubmitQuestion(questionForm: QuestionForm) {
    // Refrescar las preguntas del profesional después de enviar una nueva
    if (this.professional?.id) {
      this.refreshQuestions();
    }
  }

  private refreshQuestions() {
    if (!this.professional?.id) return;

    // Recargar los datos del profesional para obtener las preguntas actualizadas
    this.subscription.add(
      this.professionalDetailService.getProfessionalDetail(this.professional.id).subscribe(detailData => {
        if (detailData) {
          // Actualizar solo las preguntas sin recargar todo el profesional
          if ((detailData as any).questions) {
            const allQuestions = (detailData as any).questions;
            this.professionalQuestions = allQuestions.filter((question: any) => question.published === true);
            this.questionsCount = this.professionalQuestions.length;
            // Mostrar solo las primeras 2 preguntas publicadas
            this.displayedQuestions = this.professionalQuestions.slice(0, 2);
          }
        }
      })
    );
  }

  getStarsArray(rating: number): string[] {
    const stars: string[] = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    // Agregar estrellas llenas
    for (let i = 0; i < fullStars; i++) {
      stars.push('full');
    }

    // Agregar media estrella si es necesario
    if (hasHalfStar) {
      stars.push('half');
    }

    // Completar con estrellas vacías hasta 5
    while (stars.length < 5) {
      stars.push('empty');
    }

    return stars;
  }

}
