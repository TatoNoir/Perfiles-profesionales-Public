import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonModal, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonIcon, IonItem, IonLabel } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { close, mail, logoWhatsapp, logoInstagram, logoFacebook, logoLinkedin } from 'ionicons/icons';
import { ProfessionalBasic } from '../../pages/professionals/services/professionals-list.service';
import { ProfessionalDetail } from '../../pages/professional-detail/services/professional-detail.service';

// Tipo combinado que incluye tanto datos básicos como detallados
type ProfessionalFull = ProfessionalBasic & ProfessionalDetail;

@Component({
  selector: 'app-contact-modal',
  imports: [CommonModule, IonModal, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonIcon, IonItem, IonLabel],
  templateUrl: './contact-modal.html',
  styleUrl: './contact-modal.css'
})
export class ContactModalComponent {
  @Input() professional: ProfessionalFull | null = null;
  @Input() isOpen = false;
  @Output() closeModal = new EventEmitter<void>();

  constructor() {
    addIcons({ close, mail, logoWhatsapp, logoInstagram, logoFacebook, logoLinkedin });
  }

  onClose() {
    this.closeModal.emit();
  }

  onContactMethodClick(method: string, value: string) {
    switch (method) {
      case 'email':
        window.open(`mailto:${value}`, '_blank');
        break;
      case 'whatsapp':
        window.open(`https://wa.me/${value.replace(/[^0-9]/g, '')}`, '_blank');
        break;
      case 'instagram':
        window.open(`https://instagram.com/${value.replace('@', '')}`, '_blank');
        break;
      case 'facebook':
        window.open(`https://facebook.com/${value}`, '_blank');
        break;
      case 'linkedin':
        window.open(`https://linkedin.com/in/${value}`, '_blank');
        break;
    }
  }

  onBackdropClick(event: Event) {
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }
}
