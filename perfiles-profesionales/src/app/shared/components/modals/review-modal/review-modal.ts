import { Component, Input, Output, EventEmitter, OnChanges, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonModal, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonIcon, IonItem, IonLabel, IonInput, IonTextarea, IonSpinner } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { close, star, starOutline, send } from 'ionicons/icons';
import { ProfessionalBasic } from '../../../../features/professionals/pages/professionals-list/services/professionals-list.service';
import { ProfessionalDetail } from '../../../../features/professionals/pages/professional-detail/services/professional-detail.service';
import { Review } from '../../../interfaces/api-response.interface';
import { ReviewsService, ReviewForm as ApiReviewForm } from '../../../../features/professionals/pages/professional-detail/services/reviews.service';
import { Subscription } from 'rxjs';

// Tipo combinado que incluye tanto datos básicos como detallados
type ProfessionalFull = ProfessionalBasic & ProfessionalDetail;

export interface ReviewForm {
  name: string;
  email: string;
  rating: number;
  title: string;
  projectType: string;
  review: string;
}

@Component({
  selector: 'app-review-modal',
  imports: [CommonModule, FormsModule, IonModal, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonIcon, IonItem, IonLabel, IonInput, IonTextarea],
  templateUrl: './review-modal.html',
  styleUrl: './review-modal.css'
})
export class ReviewModalComponent implements OnChanges, OnInit, OnDestroy {
  @Input() professional: ProfessionalFull | null = null;
  @Input() isOpen = false;
  @Output() closeModal = new EventEmitter<void>();
  @Output() submitReview = new EventEmitter<ReviewForm>();

  reviewForm: ReviewForm = {
    name: '',
    email: '',
    rating: 0,
    title: '',
    projectType: '',
    review: ''
  };

  // Reviews properties
  professionalReviews: Review[] = [];
  averageRating = 0;
  reviewsCount = 0;

  // Form submission properties
  isSubmitting = false;
  showSuccessMessage = false;
  successMessage = '';
  sentAt = '';

  // Error handling properties
  showErrorMessage = false;
  errorMessage = '';

  private subscription: Subscription = new Subscription();

  // Expose Math to template
  Math = Math;

  constructor(private reviewsService: ReviewsService) {
    addIcons({ close, star, starOutline, send });
  }

  ngOnInit() {
    // Inicialización si es necesaria
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  ngOnChanges() {
    if (this.professional) {
      this.loadReviews();
    }
  }

  private loadReviews() {
    if (this.professional && (this.professional as any).reviewsList) {
      this.professionalReviews = (this.professional as any).reviewsList;
      this.calculateRatingStats();
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

  onClose() {
    this.closeModal.emit();
    this.resetForm();
    this.showSuccessMessage = false;
    this.successMessage = '';
    this.sentAt = '';
    this.showErrorMessage = false;
    this.errorMessage = '';
  }

  onStarClick(rating: number) {
    this.reviewForm.rating = rating;
  }

  onSubmit() {
    if (this.isFormValid() && this.professional?.id && !this.isSubmitting) {
      this.isSubmitting = true;

      const reviewData: ApiReviewForm = {
        value: this.reviewForm.rating,
        email: this.reviewForm.email,
        name: this.reviewForm.name,
        comment: this.reviewForm.review,
        user_id: parseInt(this.professional.id),
        title: this.reviewForm.title,
        project_type: this.reviewForm.projectType
      };

      this.subscription.add(
        this.reviewsService.sendReview(reviewData).subscribe({
          next: (response) => {
            this.isSubmitting = false;

            // Ocultar mensajes de error previos
            this.showErrorMessage = false;
            this.errorMessage = '';

            // Verificar si la respuesta es exitosa
            if (response && response.message && response.data && response.data.id > 0) {
              // Mostrar mensaje de éxito
              this.successMessage = response.message;
              this.sentAt = response.data.created_at;
              this.showSuccessMessage = true;

              // Emitir evento de éxito
              this.submitReview.emit(this.reviewForm);

              // Resetear formulario
              this.resetForm();

              // Cerrar modal después de 3 segundos
              setTimeout(() => {
                this.onClose();
              }, 3000);
            } else {
              // Mostrar mensaje de error
              this.errorMessage = response?.message || 'Error: Respuesta inválida del servidor';
              this.showErrorMessage = true;
            }
          },
          error: (error) => {
            this.isSubmitting = false;
            this.errorMessage = 'Error de conexión. Inténtalo de nuevo.';
            this.showErrorMessage = true;
          }
        })
      );
    }
  }

  isFormValid(): boolean {
    return !!(
      this.reviewForm.name.trim() &&
      this.reviewForm.email.trim() &&
      this.isValidEmail(this.reviewForm.email) &&
      this.reviewForm.rating > 0 &&
      this.reviewForm.title.trim() &&
      this.reviewForm.review.trim()
    );
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private resetForm() {
    this.reviewForm = {
      name: '',
      email: '',
      rating: 0,
      title: '',
      projectType: '',
      review: ''
    };
  }

  getStarsArray(): number[] {
    return [1, 2, 3, 4, 5];
  }

  isStarFilled(starIndex: number): boolean {
    return starIndex <= this.reviewForm.rating;
  }
}
