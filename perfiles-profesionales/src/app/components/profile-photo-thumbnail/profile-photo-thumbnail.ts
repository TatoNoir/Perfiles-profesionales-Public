import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageService } from '../../services/image.service';

@Component({
  selector: 'app-profile-photo-thumbnail',
  imports: [CommonModule],
  templateUrl: './profile-photo-thumbnail.html',
  styleUrl: './profile-photo-thumbnail.css'
})
export class ProfilePhotoThumbnailComponent implements OnInit, OnChanges {
  @Input() photoUrl: string | undefined;
  @Input() name: string = '';
  @Input() size: 'small' | 'medium' | 'large' = 'medium';

  fullImageUrl: string | null = null;
  showFallback: boolean = false;

  constructor(private imageService: ImageService) {}

  ngOnInit() {
    this.loadImage();
  }

  ngOnChanges() {
    this.loadImage();
  }

  private loadImage() {
    if (this.photoUrl) {

      this.fullImageUrl = this.imageService.getProfileImageUrl(this.photoUrl);
      this.showFallback = false;
    } else {

      this.fullImageUrl = null;
      this.showFallback = true;
    }
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

  onImageError(event: any) {
    // Si hay error al cargar la imagen, mostrar el fallback
    console.warn('Error loading profile image:', this.fullImageUrl);
    this.showFallback = true;
    this.fullImageUrl = null;
  }
}
