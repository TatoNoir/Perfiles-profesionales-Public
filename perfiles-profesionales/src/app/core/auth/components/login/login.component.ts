import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { IonButton, IonInput, IonItem, IonLabel, IonCard, IonCardContent, IonSpinner } from '@ionic/angular/standalone';
import { AuthService } from '../../services/auth.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, IonButton, IonInput, IonItem, IonLabel, IonCard, IonCardContent, IonSpinner],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email = '';
  password = '';
  error = '';
  isLoading = false;

  constructor(private auth: AuthService, private router: Router) {}

  async onSubmit() {
    this.error = '';
    if (!this.email || !this.password) {
      this.error = 'Completa email y contraseña';
      return;
    }
    this.isLoading = true;
    this.auth.professionalLogin({ email: this.email, password: this.password })
      .pipe(finalize(() => { this.isLoading = false; }))
      .subscribe({
      next: (resp) => {
        // Esperado 200: { access_token, token_type, expires_in, user }
        const token: string | undefined = resp?.access_token;
        if (token) {
          const user = resp?.user || {};
          this.auth.login(token, {
            id: user.id ?? 0,
            email: user.email ?? this.email,
            user_type_id: user.user_type_id ?? user.user_type?.id,
            username: user.username,
            first_name: user.first_name,
            last_name: user.last_name,
            name: user.username || user.first_name || 'Usuario',
            profile_picture: user.profile_picture,
            rates_count: user.rates_count ?? 0,
            rates_average: user.rates_average ?? 0,
            unanswered_questions: user.unanswered_questions ?? 0
          });
          this.router.navigate(['/panel']);
        } else {
          this.error = 'Respuesta inválida del servidor';
        }
      },
      error: (err) => {
        const serverMsg = err?.error?.error;
        this.error = serverMsg || 'Error al iniciar sesión';
      }
    });
  }
}


