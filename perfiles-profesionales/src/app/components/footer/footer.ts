import { Component } from '@angular/core';
import { IonButton } from '@ionic/angular/standalone';

@Component({
  selector: 'app-footer',
  imports: [IonButton],
  templateUrl: './footer.html',
  styleUrl: './footer.css'
})
export class FooterComponent {

  onRegisterClick() {
    // Aquí implementaremos la navegación al registro
  }
}
