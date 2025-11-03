import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonCard, IonCardContent, IonList, IonItem, IonButton, IonIcon, IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonTextarea, IonContent, IonSpinner, IonToast } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { star, starOutline } from 'ionicons/icons';
import { ReviewsService, Review } from '../../services/reviews.service';

@Component({
  selector: 'app-reviews-page',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe, IonCard, IonCardContent, IonList, IonItem, IonButton, IonIcon, IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonTextarea, IonContent, IonSpinner, IonToast],
  templateUrl: './reviews.component.html',
  styleUrl: './reviews.component.css'
})
export class ReviewsComponent implements OnInit {
  reviews: Review[] = [];
  loadingReviews = false;
  savingAnswer = false;

  isReplyOpen = false;
  selectedReview: Review | null = null;
  replyText = '';

  toastMessage = '';
  showToast = false;
  toastColor: 'success' | 'danger' = 'success';

  // IDs de valoraciones con respuesta enviada y pendiente de aprobación
  private pendingApprovalIds = new Set<number>();

  constructor(private reviewsService: ReviewsService) {
    addIcons({ star, starOutline });
  }

  ngOnInit() {
    this.loadReviews();
  }

  private loadReviews() {
    this.loadingReviews = true;
    this.reviewsService.getAllReviews().subscribe({
      next: (reviews) => {
        this.reviews = reviews;
        this.loadingReviews = false;
      },
      error: (error) => {
        console.error('Error al cargar reviews:', error);
        this.showErrorToast('Error al cargar las valoraciones');
        this.loadingReviews = false;
      }
    });
  }

  range(count: number): number[] {
    return Array.from({ length: count }, (_, i) => i);
  }

  getUserDisplayName(review: Review): string {
    return review.name || `${review.user.first_name} ${review.user.last_name}`.trim() || 'Usuario';
  }

  hasComment(review: Review): boolean {
    return !!review.comment && review.comment.trim().length > 0;
  }

  hasAnswer(review: Review): boolean {
    return !!review.answer && review.answer.trim().length > 0;
  }

  isPending(review: Review): boolean {
    return this.pendingApprovalIds.has(review.id);
  }

  onReply(review: Review) {
    this.selectedReview = review;
    this.replyText = review.answer || '';
    this.isReplyOpen = true;
  }

  closeReply() {
    this.isReplyOpen = false;
    this.selectedReview = null;
    this.replyText = '';
  }

  submitReply() {
    if (!this.replyText.trim() || !this.selectedReview) {
      return;
    }

    this.savingAnswer = true;
    const isNewAnswer = !this.selectedReview.answer;
    const reviewId = this.selectedReview.id;

    const request = isNewAnswer
      ? this.reviewsService.respondToReview(reviewId, this.replyText)
      : this.reviewsService.updateReviewAnswer(reviewId, this.replyText);

    request.subscribe({
      next: () => {
        // No refrescamos la lista automáticamente; marcamos como pendiente
        this.pendingApprovalIds.add(reviewId);
        this.savingAnswer = false;
        this.closeReply();
        this.showSuccessToast('Respuesta pendiente de aprobación.');
      },
      error: (error) => {
        console.error('Error al guardar la respuesta:', error);
        this.savingAnswer = false;
        this.showErrorToast('Error al guardar la respuesta. Por favor, intenta nuevamente.');
      }
    });
  }

  private showSuccessToast(message: string) {
    this.toastMessage = message;
    this.toastColor = 'success';
    this.showToast = true;
  }

  private showErrorToast(message: string) {
    this.toastMessage = message;
    this.toastColor = 'danger';
    this.showToast = true;
  }

  formatDate(dateString: string): Date {
    return new Date(dateString);
  }
}


