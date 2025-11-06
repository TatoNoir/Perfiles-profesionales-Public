import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonCard, IonCardContent, IonList, IonItem, IonButton, IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonTextarea, IonContent, IonSpinner, IonToast, IonIcon } from '@ionic/angular/standalone';
import { QuestionsService, Question } from '../../services/questions.service';
import { addIcons } from 'ionicons';
import { helpCircleOutline, checkmarkCircle } from 'ionicons/icons';

@Component({
  selector: 'app-qa-page',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe, IonCard, IonCardContent, IonList, IonItem, IonButton, IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonTextarea, IonContent, IonSpinner, IonToast, IonIcon],
  templateUrl: './qa.component.html',
  styleUrl: './qa.component.css'
})
export class QaComponent implements OnInit {
  questions: Question[] = [];
  loadingQuestions = false;
  savingAnswer = false;

  isReplyOpen = false;
  selectedQuestion: Question | null = null;
  replyText = '';

  toastMessage = '';
  showToast = false;
  toastColor: 'success' | 'danger' = 'success';

  // IDs de preguntas con respuesta enviada y pendiente de aprobación
  private pendingApprovalIds = new Set<number>();

  get answeredQuestions(): Question[] {
    return this.questions.filter(q => q.answer !== null && q.answer !== undefined && q.answer.trim().length > 0);
  }

  get unansweredQuestions(): Question[] {
    return this.questions.filter(q => q.answer === null || q.answer === undefined || q.answer.trim().length === 0);
  }

  constructor(private questionsService: QuestionsService) {
    addIcons({ helpCircleOutline, checkmarkCircle });
  }

  ngOnInit() {
    this.loadQuestions();
  }

  private loadQuestions() {
    this.loadingQuestions = true;
    this.questionsService.getAllQuestions().subscribe({
      next: (questions) => {
        this.questions = questions;
        this.loadingQuestions = false;
      },
      error: (error) => {
        console.error('Error al cargar preguntas:', error);
        this.showErrorToast('Error al cargar las preguntas');
        this.loadingQuestions = false;
      }
    });
  }

  getUserDisplayName(question: Question): string {
    return question.name || `${question.user.first_name} ${question.user.last_name}`.trim() || 'Usuario';
  }

  hasAnswer(question: Question): boolean {
    return !!question.answer && question.answer.trim().length > 0;
  }

  isPending(question: Question): boolean {
    return this.pendingApprovalIds.has(question.id);
  }

  onReply(question: Question) {
    this.selectedQuestion = question;
    this.replyText = question.answer || '';
    this.isReplyOpen = true;
  }

  closeReply() {
    this.isReplyOpen = false;
    this.selectedQuestion = null;
    this.replyText = '';
  }

  submitReply() {
    if (!this.replyText.trim() || !this.selectedQuestion) {
      return;
    }

    this.savingAnswer = true;
    const isNewAnswer = !this.selectedQuestion.answer;
    const questionId = this.selectedQuestion.id;

    const request = isNewAnswer
      ? this.questionsService.answerQuestion(questionId, this.replyText)
      : this.questionsService.updateQuestionAnswer(questionId, this.replyText);

    request.subscribe({
      next: () => {
        // No refrescamos la lista automáticamente; marcamos como pendiente
        this.loadQuestions();
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


