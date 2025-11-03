import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonModal, IonHeader, IonToolbar, IonTitle, IonButton, IonContent, IonCard, IonCardContent, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { closeOutline, star } from 'ionicons/icons';
import { Review } from '../../../interfaces/api-response.interface';

@Component({
  selector: 'app-view-reviews-modal',
  standalone: true,
  imports: [CommonModule, IonModal, IonHeader, IonToolbar, IonTitle, IonButton, IonContent, IonCard, IonCardContent, IonIcon],
  templateUrl: './view-reviews-modal.html',
  styleUrl: './view-reviews-modal.css'
})
export class ViewReviewsModalComponent {
  @Input() isOpen = false;
  @Input() professionalName = '';
  @Input() set reviews(reviews: Review[]) {
    this.professionalReviews = reviews || [];
    this.calculateRatingStats();
  }
  @Output() modalClosed = new EventEmitter<void>();

  professionalReviews: Review[] = [];
  averageRating = 0;
  reviewsCount = 0;

  constructor() {
    addIcons({ closeOutline, star });
  }

  onClose() {
    this.isOpen = false;
    this.modalClosed.emit();
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

  getStarsArray(): number[] {
    return [1, 2, 3, 4, 5];
  }
}
