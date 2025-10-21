import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile-photo-thumbnail',
  imports: [CommonModule],
  templateUrl: './profile-photo-thumbnail.html',
  styleUrl: './profile-photo-thumbnail.css'
})
export class ProfilePhotoThumbnailComponent {
  @Input() photoUrl: string | undefined;
  @Input() name: string = '';
  @Input() size: 'small' | 'medium' | 'large' = 'medium';

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

  onImageError(event: any) {
    console.log('Error al cargar la imagen de perfil:', event);
    // Si hay error al cargar la imagen, ocultamos la imagen
    const img = event.target as HTMLImageElement;
    img.style.display = 'none';
  }
}
