import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonModal, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonIcon, IonItem, IonLabel } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { close, mail, logoWhatsapp, logoInstagram, logoFacebook, logoLinkedin } from 'ionicons/icons';
import { Professional } from '../../services/professional';

@Component({
  selector: 'app-contact-modal',
  imports: [CommonModule, IonModal, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonIcon, IonItem, IonLabel],
  templateUrl: './contact-modal.html',
  styleUrl: './contact-modal.css'
})
export class ContactModalComponent {
  @Input() professional: Professional | null = null;
  @Input() isOpen = false;
  @Output() closeModal = new EventEmitter<void>();

  constructor() {
    console.log('ContactModalComponent initialized');
    addIcons({ close, mail, logoWhatsapp, logoInstagram, logoFacebook, logoLinkedin });
  }

  onClose() {
    console.log('Closing contact modal');
    this.closeModal.emit();
  }

  onContactMethodClick(method: string, value: string) {
    console.log(`Contactar por ${method}:`, value);

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
