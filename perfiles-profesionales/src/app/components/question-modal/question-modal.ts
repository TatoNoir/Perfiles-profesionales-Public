import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonModal, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonIcon, IonItem, IonLabel, IonInput, IonTextarea, IonSpinner } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { close, chatbubbleOutline, send } from 'ionicons/icons';
import { Subscription } from 'rxjs';
import { ProfessionalBasic } from '../../pages/professionals/services/professionals-list.service';
import { ProfessionalDetail } from '../../pages/professional-detail/services/professional-detail.service';
import { QaService, Question as QaQuestion, QuestionForm as QaQuestionForm } from '../../pages/professional-detail/services/qa.service';
import { Question as ApiQuestion } from '../../interfaces/api-response.interface';

// Tipo combinado que incluye tanto datos básicos como detallados
type ProfessionalFull = ProfessionalBasic & ProfessionalDetail;

export interface QuestionForm {
  email: string;
  name: string;
  message: string;
  user_id: number;
}

export interface Question {
  id: string;
  name: string;
  question: string;
  answer?: string;
  date: Date;
}

@Component({
  selector: 'app-question-modal',
  imports: [CommonModule, FormsModule, IonModal, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonIcon, IonItem, IonLabel, IonInput, IonTextarea, IonSpinner],
  templateUrl: './question-modal.html',
  styleUrl: './question-modal.css'
})
export class QuestionModalComponent implements OnInit, OnDestroy {
  @Input() professional: ProfessionalFull | null = null;
  @Input() isOpen = false;
  @Output() closeModal = new EventEmitter<void>();
  @Output() submitQuestion = new EventEmitter<QuestionForm>();

  questionForm: QuestionForm = {
    email: '',
    name: '',
    message: '',
    user_id: 0
  };

  existingQuestions: ApiQuestion[] = [];
  isLoading = false;
  isSubmitting = false;
  showSuccessMessage = false;
  successMessage = '';
  sentAt = '';
  private subscription = new Subscription();

  constructor(private qaService: QaService) {
    addIcons({ close, chatbubbleOutline, send });
  }

  ngOnInit() {
    if (this.professional) {
      this.loadQuestionsFromProfessional();
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private loadQuestionsFromProfessional() {
    if (!this.professional) return;

    // Los datos del profesional ya incluyen las preguntas
    // Verificamos si el profesional tiene preguntas en sus datos
    if ((this.professional as any).questions && Array.isArray((this.professional as any).questions)) {
      this.existingQuestions = (this.professional as any).questions;
    } else {
      this.existingQuestions = [];
    }
  }

  onClose() {
    this.closeModal.emit();
    this.resetForm();
    this.showSuccessMessage = false;
    this.successMessage = '';
    this.sentAt = '';
  }

  onSubmit() {
    if (this.isFormValid() && this.professional?.id && !this.isSubmitting) {
      this.isSubmitting = true;

      const questionData: QaQuestionForm = {
        email: this.questionForm.email,
        name: this.questionForm.name,
        message: this.questionForm.message,
        user_id: parseInt(this.professional.id) // Convertir string a number
      };

      this.subscription.add(
        this.qaService.sendQuestion(questionData).subscribe({
          next: (response) => {
            this.isSubmitting = false;

            // Verificar si la respuesta es exitosa
            if (response && response.message && response.data) {
              // Mostrar mensaje de éxito
              this.successMessage = response.message;
              this.sentAt = response.data.created_at;
              this.showSuccessMessage = true;

              // Emitir evento de éxito
              this.submitQuestion.emit(this.questionForm);

              // Resetear formulario
              this.resetForm();

              // Cerrar modal después de 3 segundos
              setTimeout(() => {
                this.onClose();
              }, 3000);
            } else {
              alert('Error: Respuesta inválida del servidor');
            }
          },
          error: (error) => {
            this.isSubmitting = false;
            alert('Error al enviar la pregunta. Inténtalo de nuevo.');
          }
        })
      );
    }
  }

  isFormValid(): boolean {
    return !!(
      this.questionForm.name.trim() &&
      this.questionForm.email.trim() &&
      this.questionForm.message.trim() &&
      this.isValidEmail(this.questionForm.email)
    );
  }

  private resetForm() {
    this.questionForm = {
      email: '',
      name: '',
      message: '',
      user_id: 0
    };
  }

  get hasQuestions(): boolean {
    return this.existingQuestions.length > 0;
  }

  getQuestionPlaceholder(): string {
    if (this.professional) {
      return `Pregunta algo a ${this.professional.name}...`;
    }
    return 'Escribe tu pregunta aquí...';
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
