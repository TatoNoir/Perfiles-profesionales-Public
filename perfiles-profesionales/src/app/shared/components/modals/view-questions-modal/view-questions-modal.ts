import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonModal, IonHeader, IonToolbar, IonTitle, IonButton, IonContent, IonCard, IonCardContent, IonIcon, IonSpinner } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { closeOutline, chatbubbleOutline, chevronBack, chevronForward } from 'ionicons/icons';
import { QaService } from '../../../../features/professionals/pages/professional-detail/services/qa.service';
import { Question as ApiQuestion } from '../../../interfaces/api-response.interface';

@Component({
  selector: 'app-view-questions-modal',
  standalone: true,
  imports: [CommonModule, IonModal, IonHeader, IonToolbar, IonTitle, IonButton, IonContent, IonCard, IonCardContent, IonIcon, IonSpinner],
  templateUrl: './view-questions-modal.html',
  styleUrl: './view-questions-modal.css'
})
export class ViewQuestionsModalComponent implements OnInit, OnChanges {
  @Input() isOpen = false;
  @Input() professionalName = '';
  @Input() professionalId: string = '';
  @Input() set questions(questions: any[]) {
    // Mantener compatibilidad con el input anterior, pero ahora cargamos desde el servicio
    if (questions && questions.length > 0 && !this.professionalId) {
      const filtered = (questions || []).filter((question: any) => question.published === true);
      this.professionalQuestions = filtered;
      this.questionsCount = filtered.length;
      this.displayedQuestions = filtered.slice(0, 5);
    }
  }
  @Output() modalClosed = new EventEmitter<void>();

  professionalQuestions: ApiQuestion[] = [];
  displayedQuestions: ApiQuestion[] = [];
  questionsCount = 0;
  isLoading = false;

  // Paginación
  currentPage = 1;
  limit = 5;
  totalPages = 0;
  totalQuestions = 0;

  constructor(private qaService: QaService) {
    addIcons({ closeOutline, chatbubbleOutline, chevronBack, chevronForward });
  }

  ngOnInit() {
    if (this.isOpen && this.professionalId) {
      this.loadQuestions();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['isOpen'] && changes['isOpen'].currentValue && this.professionalId) {
      this.currentPage = 1;
      this.loadQuestions();
    }
  }

  onClose() {
    this.isOpen = false;
    this.modalClosed.emit();
  }

  loadQuestions() {
    if (!this.professionalId) return;

    this.isLoading = true;
    this.qaService.getQuestions(this.professionalId, this.currentPage, this.limit).subscribe({
      next: (response) => {
        // Filtrar solo las preguntas publicadas
        const publishedQuestions = (response.questions || []).filter((question: any) => question.published === true);
        this.professionalQuestions = publishedQuestions;
        this.displayedQuestions = publishedQuestions;
        this.totalQuestions = response.total;
        this.totalPages = response.totalPages;
        this.currentPage = response.page;
        this.questionsCount = this.totalQuestions;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar preguntas:', error);
        this.professionalQuestions = [];
        this.displayedQuestions = [];
        this.isLoading = false;
      }
    });
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.currentPage = page;
      this.loadQuestions();
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

  get hasQuestions(): boolean {
    return this.totalQuestions > 0 || this.professionalQuestions.length > 0;
  }
}
