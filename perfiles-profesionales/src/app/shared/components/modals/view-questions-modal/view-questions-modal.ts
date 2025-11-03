import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonModal, IonHeader, IonToolbar, IonTitle, IonButton, IonContent, IonCard, IonCardContent, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { closeOutline, chatbubbleOutline } from 'ionicons/icons';

@Component({
  selector: 'app-view-questions-modal',
  standalone: true,
  imports: [CommonModule, IonModal, IonHeader, IonToolbar, IonTitle, IonButton, IonContent, IonCard, IonCardContent, IonIcon],
  templateUrl: './view-questions-modal.html',
  styleUrl: './view-questions-modal.css'
})
export class ViewQuestionsModalComponent {
  @Input() isOpen = false;
  @Input() professionalName = '';
  @Input() set questions(questions: any[]) {
    // Filtrar solo las preguntas publicadas (published: true)
    this.professionalQuestions = (questions || []).filter((question: any) => question.published === true);
    this.questionsCount = this.professionalQuestions.length;
    this.displayedQuestions = this.professionalQuestions.slice(0, 5); // Mostrar las primeras 5 publicadas
  }
  @Output() modalClosed = new EventEmitter<void>();

  professionalQuestions: any[] = [];
  displayedQuestions: any[] = [];
  questionsCount = 0;

  constructor() {
    addIcons({ closeOutline, chatbubbleOutline });
  }

  onClose() {
    this.isOpen = false;
    this.modalClosed.emit();
  }

  get hasQuestions(): boolean {
    return this.professionalQuestions.length > 0;
  }

  get hasMoreQuestions(): boolean {
    return this.questionsCount > 5;
  }

  showMoreQuestions() {
    // Mostrar todas las preguntas
    this.displayedQuestions = this.professionalQuestions;
  }
}
