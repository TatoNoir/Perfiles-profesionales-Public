import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { IonButton, IonInput, IonItem, IonLabel, IonCard, IonCardContent } from '@ionic/angular/standalone';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, IonButton, IonInput, IonItem, IonLabel, IonCard, IonCardContent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email = '';
  password = '';
  error = '';

  constructor(private auth: AuthService, private router: Router) {}

  async onSubmit() {
    this.error = '';
    if (!this.email || !this.password) {
      this.error = 'Completa email y contraseña';
      return;
    }
    // Placeholder: asumir login ok y guardar token + usuario profesional
    this.auth.login('demo-token', { id: 1, email: this.email, user_type_id: 2, name: 'Profesional' });
    this.router.navigate(['/panel']);
  }
}


