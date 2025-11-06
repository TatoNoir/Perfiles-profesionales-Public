import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { IonButton, IonInput, IonItem, IonLabel, IonCard, IonCardContent, IonSpinner, IonToast } from '@ionic/angular/standalone';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, IonButton, IonInput, IonItem, IonLabel, IonCard, IonCardContent, IonSpinner, IonToast],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {
  // Paso 1: Solicitar token
  email = '';
  requestingToken = false;
  tokenReceived = false;
  resetToken = '';

  // Paso 2: Resetear contraseña
  password = '';
  passwordConfirmation = '';
  resettingPassword = false;
  passwordReset = false;

  // Mensajes y errores
  error = '';
  successMessage = '';
  showToast = false;
  toastMessage = '';
  toastColor: 'success' | 'danger' = 'success';

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  // Paso 1: Solicitar token de recuperación
  onRequestToken() {
    if (!this.email || !this.isValidEmail(this.email)) {
      this.showErrorToast('Por favor, ingresa un email válido');
      return;
    }

    this.requestingToken = true;
    this.error = '';

    this.authService.forgotPassword(this.email).subscribe({
      next: (response) => {
        this.resetToken = response.reset_token;
        this.tokenReceived = true;
        this.requestingToken = false;
        this.showSuccessToast('Por favor, ingresa tu nueva contraseña.');
      },
      error: (error) => {
        this.requestingToken = false;
        const errorMsg = error.error?.message || error.message || 'Error al solicitar el token. Por favor, intenta nuevamente.';
        this.showErrorToast(errorMsg);
      }
    });
  }

  // Paso 2: Resetear contraseña
  onResetPassword() {
    // Validaciones
    if (!this.password || this.password.length < 6) {
      this.showErrorToast('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (this.password !== this.passwordConfirmation) {
      this.showErrorToast('Las contraseñas no coinciden');
      return;
    }

    this.resettingPassword = true;
    this.error = '';

    this.authService.resetPassword({
      email: this.email,
      token: this.resetToken,
      password: this.password,
      password_confirmation: this.passwordConfirmation
    }).subscribe({
      next: (response) => {
        this.resettingPassword = false;
        this.passwordReset = true;
        this.showSuccessToast(response.message || 'Contraseña actualizada correctamente');

        // Redirigir al login después de 2 segundos
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (error) => {
        this.resettingPassword = false;
        const errorMsg = error.error?.message || error.message || 'Error al resetear la contraseña. Por favor, intenta nuevamente.';
        this.showErrorToast(errorMsg);
      }
    });
  }

  // Validación de email
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Mostrar toast de éxito
  showSuccessToast(message: string) {
    this.toastMessage = message;
    this.toastColor = 'success';
    this.showToast = true;
  }

  // Mostrar toast de error
  showErrorToast(message: string) {
    this.toastMessage = message;
    this.toastColor = 'danger';
    this.showToast = true;
  }
}


