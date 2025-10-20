import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonModal, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonIcon, IonItem, IonLabel, IonInput, IonTextarea } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { close, star, starOutline } from 'ionicons/icons';
import { Professional } from '../../services/professional';

export interface ReviewForm {
  name: string;
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
export class ReviewModalComponent {
  @Input() professional: Professional | null = null;
  @Input() isOpen = false;
  @Output() closeModal = new EventEmitter<void>();
  @Output() submitReview = new EventEmitter<ReviewForm>();

  reviewForm: ReviewForm = {
    name: '',
    rating: 0,
    title: '',
    projectType: '',
    review: ''
  };

  // Expose Math to template
  Math = Math;

  constructor() {
    addIcons({ close, star, starOutline });
  }

  onClose() {
    this.closeModal.emit();
    this.resetForm();
  }

  onStarClick(rating: number) {
    this.reviewForm.rating = rating;
  }

  onSubmit() {
    if (this.isFormValid()) {
      this.submitReview.emit(this.reviewForm);
      this.resetForm();
      this.onClose();
    }
  }

  isFormValid(): boolean {
    return !!(
      this.reviewForm.name.trim() &&
      this.reviewForm.rating > 0 &&
      this.reviewForm.title.trim() &&
      this.reviewForm.review.trim()
    );
  }

  private resetForm() {
    this.reviewForm = {
      name: '',
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
