import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IonButton } from '@ionic/angular/standalone';

@Component({
  selector: 'app-footer',
  imports: [IonButton],
  templateUrl: './footer.html',
  styleUrl: './footer.css'
})
export class FooterComponent {

  constructor(private router: Router) {}

  onRegisterClick() {
    this.router.navigate(['/register-professional']);
  }
}
