import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonModal, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonIcon, IonItem, IonLabel, IonInput, IonTextarea } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { close, chatbubbleOutline, send } from 'ionicons/icons';
import { ProfessionalBasic } from '../../pages/professionals/services/professionals-list.service';
import { ProfessionalDetail } from '../../pages/professional-detail/services/professional-detail.service';

// Tipo combinado que incluye tanto datos básicos como detallados
type ProfessionalFull = ProfessionalBasic & ProfessionalDetail;

export interface QuestionForm {
  name: string;
  question: string;
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
  imports: [CommonModule, FormsModule, IonModal, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonIcon, IonItem, IonLabel, IonInput, IonTextarea],
  templateUrl: './question-modal.html',
  styleUrl: './question-modal.css'
})
export class QuestionModalComponent {
  @Input() professional: ProfessionalFull | null = null;
  @Input() isOpen = false;
  @Output() closeModal = new EventEmitter<void>();
  @Output() submitQuestion = new EventEmitter<QuestionForm>();

  questionForm: QuestionForm = {
    name: '',
    question: ''
  };

  // Simulamos algunas preguntas existentes (en una app real vendrían del backend)
  existingQuestions: Question[] = [
    {
      id: '1',
      name: 'María González',
      question: '¿Cuál es tu experiencia con React y TypeScript?',
      answer: 'Tengo más de 5 años trabajando con React y TypeScript. He desarrollado aplicaciones complejas y siempre me mantengo actualizado con las últimas versiones.',
      date: new Date('2024-01-15')
    },
    {
      id: '2',
      name: 'Carlos Ruiz',
      question: '¿Trabajas con metodologías ágiles?',
      answer: 'Sí, tengo experiencia con Scrum y Kanban. He trabajado en equipos ágiles durante los últimos 3 años.',
      date: new Date('2024-01-10')
    }
  ];

  constructor() {
    addIcons({ close, chatbubbleOutline, send });
  }

  onClose() {
    this.closeModal.emit();
    this.resetForm();
  }

  onSubmit() {
    if (this.isFormValid()) {
      this.submitQuestion.emit(this.questionForm);
      this.resetForm();
      this.onClose();
    }
  }

  isFormValid(): boolean {
    return !!(
      this.questionForm.name.trim() &&
      this.questionForm.question.trim()
    );
  }

  private resetForm() {
    this.questionForm = {
      name: '',
      question: ''
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
}
