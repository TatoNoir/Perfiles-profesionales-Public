import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { IonButton, IonInput, IonItem, IonLabel, IonCard, IonCardContent } from '@ionic/angular/standalone';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, IonButton, IonInput, IonItem, IonLabel, IonCard, IonCardContent],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {
  email = '';
  sent = false;

  constructor(private router: Router) {}

  onSubmit() {
    if (!this.email) return;
    this.sent = true;
  }
}


