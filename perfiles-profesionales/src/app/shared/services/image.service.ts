import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  private baseUrl = environment.apiUrl;

  constructor() {}

  /**
   * Construye la URL completa para una imagen de perfil
   * @param imagePath - Ruta relativa de la imagen (ej: "profile_pictures/JZ17eeEOd4qElSccyCWCKbDTprzhnHTJv1W4OphV.png")
   * @returns URL completa de la imagen
   */
  getProfileImageUrl(imagePath: string | null | undefined): string | null {
    if (!imagePath) {
      return null;
    }

    // Si ya es una URL completa, devolverla tal como está
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }

    // Construir la URL completa
    return `${this.baseUrl}/${imagePath}`;
  }

  /**
   * Verifica si una imagen existe y es válida
   * @param imagePath - Ruta de la imagen
   * @returns Promise que resuelve a true si la imagen existe
   */
  async validateImage(imagePath: string): Promise<boolean> {
    try {
      const imageUrl = this.getProfileImageUrl(imagePath);
      if (!imageUrl) return false;

      const response = await fetch(imageUrl, { method: 'HEAD' });
      return response.ok;
    } catch (error) {

      return false;
    }
  }

  /**
   * Obtiene la URL de una imagen con fallback
   * @param imagePath - Ruta de la imagen
   * @param fallbackPath - Ruta de fallback si la imagen principal no existe
   * @returns URL de la imagen o fallback
   */
  async getImageUrlWithFallback(imagePath: string | null | undefined, fallbackPath?: string): Promise<string | null> {
    if (!imagePath) {
      return fallbackPath ? this.getProfileImageUrl(fallbackPath) : null;
    }

    const isValid = await this.validateImage(imagePath);
    if (isValid) {
      return this.getProfileImageUrl(imagePath);
    }

    // Si la imagen principal no es válida, usar fallback
    if (fallbackPath) {
      const fallbackIsValid = await this.validateImage(fallbackPath);
      if (fallbackIsValid) {
        return this.getProfileImageUrl(fallbackPath);
      }
    }

    return null;
  }
}

