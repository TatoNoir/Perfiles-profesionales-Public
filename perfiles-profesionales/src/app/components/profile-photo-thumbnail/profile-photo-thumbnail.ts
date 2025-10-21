import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonButton, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { camera, image } from 'ionicons/icons';

@Component({
  selector: 'app-profile-photo-thumbnail',
  imports: [CommonModule, IonButton, IonIcon],
  templateUrl: './profile-photo-thumbnail.html',
  styleUrl: './profile-photo-thumbnail.css'
})
export class ProfilePhotoThumbnailComponent {
  @Input() photoUrl: string | undefined;
  @Input() name: string = '';
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Input() showChangeButton: boolean = true;
  @Input() isEditable: boolean = true;

  @Output() photoChange = new EventEmitter<File>();
  @Output() photoRemove = new EventEmitter<void>();

  constructor() {
    addIcons({ camera, image });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file && this.isValidImageFile(file)) {
      this.photoChange.emit(file);
    } else {
      alert('Por favor selecciona un archivo de imagen válido (JPG, PNG, GIF)');
    }
  }

  onRemovePhoto() {
    this.photoRemove.emit();
  }

  private isValidImageFile(file: File): boolean {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    return validTypes.includes(file.type);
  }

  getInitials(): string {
    if (!this.name) return '?';
    const names = this.name.split(' ');
    const firstInitial = names[0]?.charAt(0) || '';
    const secondInitial = names[1]?.charAt(0) || '';
    return (firstInitial + secondInitial).toUpperCase();
  }

  getSizeClass(): string {
    return `thumbnail-${this.size}`;
  }

  triggerFileInput() {
    const fileInput = document.querySelector('.file-input') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }

  onImageError(event: any) {
    console.log('Error al cargar la imagen de perfil:', event);
    // Si hay error al cargar la imagen, ocultamos la imagen
    const img = event.target as HTMLImageElement;
    img.style.display = 'none';
  }
}
