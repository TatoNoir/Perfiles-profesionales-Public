import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonCard, IonCardContent, IonList, IonItem, IonButton, IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonTextarea, IonContent } from '@ionic/angular/standalone';

@Component({
  selector: 'app-qa-page',
  standalone: true,
  imports: [CommonModule, FormsModule, IonCard, IonCardContent, IonList, IonItem, IonButton, IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonTextarea, IonContent],
  templateUrl: './qa.component.html',
  styleUrl: './qa.component.css'
})
export class QaComponent {
  questions = [
    { id: 1, user: 'Pedro', question: '¿Cuánto tarda el servicio estándar?', answer: 'Generalmente 48-72 hs.' },
    { id: 2, user: 'Sofía', question: '¿Trabajás fines de semana?', answer: '' },
    { id: 3, user: 'Martín', question: '¿Emitís factura?', answer: 'Sí, factura C.' },
    { id: 4, user: 'Laura', question: '¿Zona de cobertura?', answer: 'CABA y GBA norte.' },
    { id: 5, user: 'Elena', question: '¿Métodos de pago aceptados?', answer: '' }
  ];

  isReplyOpen = false;
  selectedQuestionId: number | null = null;
  replyText = '';

  onReply(questionId: number, currentAnswer: string) {
    this.selectedQuestionId = questionId;
    this.replyText = currentAnswer || '';
    this.isReplyOpen = true;
  }

  closeReply() { this.isReplyOpen = false; }

  submitReply() {
    if (!this.replyText.trim() || this.selectedQuestionId == null) { this.isReplyOpen = false; return; }
    // TODO: llamar endpoint para responder pregunta
    const q = this.questions.find(q => q.id === this.selectedQuestionId);
    if (q) q.answer = this.replyText;
    this.isReplyOpen = false;
  }
}


