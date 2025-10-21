import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonIcon, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonChip, IonSpinner } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowBack, checkmarkCircle, star, location, mail, briefcase, chatbubbleOutline } from 'ionicons/icons';
import { ProfessionalService, Professional } from '../../services/professional';
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
  professional: Professional | null = null;
  isContactModalOpen = false;
  isReviewModalOpen = false;
  isQuestionModalOpen = false;
  private subscription: Subscription = new Subscription();

  // Expose Math to template
  Math = Math;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private professionalService: ProfessionalService
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
    this.subscription.add(
      this.professionalService.getProfessionalById(id).subscribe(professional => {
        this.professional = professional || null;
      })
    );
  }

  goBack() {
    this.router.navigate(['/professionals']);
  }

  contactProfessional() {
    console.log('Contactar a:', this.professional?.name);
    this.isContactModalOpen = true;
  }

  onCloseContactModal() {
    this.isContactModalOpen = false;
  }

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

  onLeaveReview() {
    console.log('Dejar valoración para:', this.professional?.name);
    this.isReviewModalOpen = true;
  }

  onCloseReviewModal() {
    this.isReviewModalOpen = false;
  }

  onSubmitReview(reviewForm: ReviewForm) {
    console.log('Reseña enviada:', reviewForm);
    // Aquí implementaremos la lógica para guardar la reseña
    // Por ahora solo mostramos un mensaje de confirmación
    alert('¡Reseña enviada exitosamente!');
  }

  onAskQuestion() {
    console.log('Hacer una pregunta a:', this.professional?.name);
    this.isQuestionModalOpen = true;
  }

  onCloseQuestionModal() {
    this.isQuestionModalOpen = false;
  }

  onSubmitQuestion(questionForm: QuestionForm) {
    console.log('Pregunta enviada:', questionForm);
    // Aquí implementaremos la lógica para guardar la pregunta
    // Por ahora solo mostramos un mensaje de confirmación
    alert('¡Pregunta enviada exitosamente!');
  }

  onImageError(event: any) {
    console.log('Error al cargar la imagen de perfil:', event);
    // Si hay error al cargar la imagen, ocultamos la imagen y mostramos el avatar con iniciales
    const img = event.target as HTMLImageElement;
    img.style.display = 'none';
    // El avatar con iniciales se mostrará automáticamente ya que está condicionado con *ngIf="!professional.avatar"
  }

  onPhotoChange(file: File) {
    console.log('Nueva foto seleccionada:', file);

    // Crear una URL temporal para mostrar la imagen inmediatamente
    const reader = new FileReader();
    reader.onload = (e: any) => {
      if (this.professional) {
        this.professional.avatar = e.target.result;
      }
    };
    reader.readAsDataURL(file);

    // Aquí implementarías la lógica para subir la imagen al servidor
    // Por ahora solo mostramos un mensaje
    alert('Foto actualizada exitosamente! (En una implementación real, se subiría al servidor)');
  }

  onPhotoRemove() {
    console.log('Eliminar foto de perfil');
    if (this.professional) {
      this.professional.avatar = undefined;
    }
    alert('Foto eliminada exitosamente!');
  }
}
