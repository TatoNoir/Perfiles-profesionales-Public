import { Component } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonCard, IonCardContent, IonList, IonItem, IonButton, IonIcon, IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonTextarea, IonContent } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { star, starOutline } from 'ionicons/icons';

@Component({
  selector: 'app-reviews-page',
  standalone: true,
  imports: [CommonModule, FormsModule, IonCard, IonCardContent, IonList, IonItem, IonButton, IonIcon, IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonTextarea, IonContent],
  templateUrl: './reviews.component.html',
  styleUrl: './reviews.component.css'
})
export class ReviewsComponent {
  reviews = [
    { id: 1, user: 'Juan P.', rating: 5, comment: 'Excelente trabajo y muy profesional.', date: new Date() },
    { id: 2, user: 'María G.', rating: 4, comment: 'Muy buena atención.', date: new Date(Date.now() - 86400000) },
    { id: 3, user: 'Carlos R.', rating: 5, comment: 'Rápido y eficaz.', date: new Date(Date.now() - 2*86400000) },
    { id: 4, user: 'Lucía S.', rating: 3, comment: 'Podría mejorar en tiempos.', date: new Date(Date.now() - 3*86400000) },
    { id: 5, user: 'Ana D.', rating: 4, comment: 'Quedé conforme con el resultado.', date: new Date(Date.now() - 5*86400000) }
  ];

  constructor() {
    addIcons({ star, starOutline });
  }

  range(count: number): number[] { return Array.from({ length: count }, (_, i) => i); }

  isReplyOpen = false;
  selectedReviewId: number | null = null;
  replyText = '';

  onReply(reviewId: number) {
    this.selectedReviewId = reviewId;
    this.replyText = '';
    this.isReplyOpen = true;
  }

  closeReply() { this.isReplyOpen = false; }

  submitReply() {
    if (!this.replyText.trim()) return;
    // TODO: llamar endpoint para responder
    console.log('Enviar respuesta', { reviewId: this.selectedReviewId, text: this.replyText });
    this.isReplyOpen = false;
  }
}


