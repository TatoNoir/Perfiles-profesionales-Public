import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonIcon, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonChip, IonSpinner } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowBack, checkmarkCircle, star, location, mail, briefcase, chatbubbleOutline } from 'ionicons/icons';
import { ProfessionalDetailService, ProfessionalDetail } from './services/professional-detail.service';
import { ProfessionalBasic } from '../../pages/professionals/services/professionals-list.service';

// Tipo combinado que incluye tanto datos básicos como detallados
type ProfessionalFull = ProfessionalBasic & ProfessionalDetail;
import { ContactModalComponent } from '../../components/contact-modal/contact-modal';
import { ReviewModalComponent, ReviewForm } from '../../components/review-modal/review-modal';
import { QuestionModalComponent, QuestionForm } from '../../components/question-modal/question-modal';
import { ProfilePhotoThumbnailComponent } from '../../components/profile-photo-thumbnail/profile-photo-thumbnail';

@Component({
  selector: 'app-professional-detail',
  imports: [CommonModule, IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonIcon, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonChip, IonSpinner, ContactModalComponent, ReviewModalComponent, QuestionModalComponent, ProfilePhotoThumbnailComponent],
  templateUrl: './professional-detail.html',
  styleUrl: './professional-detail.css'
})
export class ProfessionalDetailComponent implements OnInit, OnDestroy {
  professional: ProfessionalFull | null = null;
  isContactModalOpen = false;
  isReviewModalOpen = false;
  isQuestionModalOpen = false;
  private subscription: Subscription = new Subscription();

  // Expose Math to template
  Math = Math;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private professionalDetailService: ProfessionalDetailService
  ) {
    addIcons({ arrowBack, checkmarkCircle, star, location, mail, briefcase, chatbubbleOutline });
  }

  ngOnInit() {
    this.subscription = this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.loadProfessional(id);
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private loadProfessional(id: string) {
    // Cargar datos detallados del profesional
    this.subscription.add(
      this.professionalDetailService.getProfessionalDetail(id).subscribe(detailData => {
        if (detailData) {
          // Los datos detallados ya incluyen toda la información necesaria
          this.professional = detailData as ProfessionalFull;
        } else {
          this.professional = null;
        }
      })
    );
  }

  goBack() {
    this.router.navigate(['/professionals']);
  }

  contactProfessional() {
    this.isContactModalOpen = true;
  }

  onCloseContactModal() {
    this.isContactModalOpen = false;
  }

  /*

  getStatusText(status: string): string {
    switch (status) {
      case 'available': return 'Disponible';
      case 'busy': return 'Ocupado';
      case 'offline': return 'Desconectado';
      default: return 'Desconectado';
    }
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'available': return '#10B981';
      case 'busy': return '#F59E0B';
      case 'offline': return '#EF4444';
      default: return '#6B7280';
    }
  }

  */

  onLeaveReview() {
    this.isReviewModalOpen = true;
  }

  onCloseReviewModal() {
    this.isReviewModalOpen = false;
  }

  onSubmitReview(reviewForm: ReviewForm) {
    // Aquí implementaremos la lógica para guardar la reseña
    // Por ahora solo mostramos un mensaje de confirmación
    alert('¡Reseña enviada exitosamente!');
  }

  onAskQuestion() {
    this.isQuestionModalOpen = true;
  }

  onCloseQuestionModal() {
    this.isQuestionModalOpen = false;
  }

  onSubmitQuestion(questionForm: QuestionForm) {
    // Aquí implementaremos la lógica para guardar la pregunta
    // Por ahora solo mostramos un mensaje de confirmación
    alert('¡Pregunta enviada exitosamente!');
  }

}
