import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  imports: [],
  templateUrl: './footer.html',
  styleUrl: './footer.css'
})
export class FooterComponent {

  onRegisterClick() {
    console.log('Registrarse como profesional');
    // Aquí implementaremos la navegación al registro
  }
}
