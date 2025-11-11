import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonModal, IonHeader, IonToolbar, IonTitle, IonButton, IonContent, IonCard, IonCardContent, IonIcon, IonSpinner } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { closeOutline, star, chevronBack, chevronForward } from 'ionicons/icons';
import { Review } from '../../../interfaces/api-response.interface';
import { ReviewsService } from '../../../../features/professionals/pages/professional-detail/services/reviews.service';

@Component({
  selector: 'app-view-reviews-modal',
  standalone: true,
  imports: [CommonModule, IonModal, IonHeader, IonToolbar, IonTitle, IonButton, IonContent, IonCard, IonCardContent, IonIcon, IonSpinner],
  templateUrl: './view-reviews-modal.html',
  styleUrl: './view-reviews-modal.css'
})
export class ViewReviewsModalComponent implements OnInit, OnChanges {
  @Input() isOpen = false;
  @Input() professionalName = '';
  @Input() professionalId: string = '';
  @Input() set reviews(reviews: Review[]) {
    // Mantener compatibilidad con el input anterior, pero ahora cargamos desde el servicio
    if (reviews && reviews.length > 0 && !this.professionalId) {
      this.professionalReviews = reviews || [];
      this.calculateRatingStats();
    }
  }
  @Output() modalClosed = new EventEmitter<void>();

  professionalReviews: Review[] = [];
  averageRating = 0;
  reviewsCount = 0;
  isLoading = false;

  // Paginación
  currentPage = 1;
  limit = 5;
  totalPages = 0;
  totalReviews = 0;

  constructor(private reviewsService: ReviewsService) {
    addIcons({ closeOutline, star, chevronBack, chevronForward });
  }

  ngOnInit() {
    if (this.isOpen && this.professionalId) {
      this.loadReviews();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['isOpen'] && changes['isOpen'].currentValue && this.professionalId) {
      this.currentPage = 1;
      this.loadReviews();
    }
  }

  onClose() {
    this.isOpen = false;
    this.modalClosed.emit();
  }

  loadReviews() {
    if (!this.professionalId) return;

    this.isLoading = true;
    this.reviewsService.getReviews(this.professionalId, this.currentPage, this.limit).subscribe({
      next: (response) => {
        this.professionalReviews = response.reviews;
        this.totalReviews = response.total;
        this.totalPages = response.totalPages;
        this.currentPage = response.page;
        this.calculateRatingStats();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar valoraciones:', error);
        this.professionalReviews = [];
        this.isLoading = false;
      }
    });
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.currentPage = page;
      this.loadReviews();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.goToPage(this.currentPage + 1);
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.goToPage(this.currentPage - 1);
    }
  }

  get canGoPrevious(): boolean {
    return this.currentPage > 1;
  }

  get canGoNext(): boolean {
    return this.currentPage < this.totalPages;
  }

  private calculateRatingStats() {
    if (this.professionalReviews.length === 0) {
      this.averageRating = 0;
      this.reviewsCount = this.totalReviews || 0;
      return;
    }

    // Calcular promedio solo de las reviews de la página actual
    const totalRating = this.professionalReviews.reduce((sum, review) => sum + review.value, 0);
    this.averageRating = totalRating / this.professionalReviews.length;
    this.reviewsCount = this.totalReviews || this.professionalReviews.length;
  }

  get hasReviews(): boolean {
    return this.totalReviews > 0 || this.professionalReviews.length > 0;
  }

  getStarsArray(): number[] {
    return [1, 2, 3, 4, 5];
  }
}
