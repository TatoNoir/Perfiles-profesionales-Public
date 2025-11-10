import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router, NavigationEnd } from '@angular/router';
import { IonContent, IonHeader, IonToolbar, IonTitle, IonButton, IonButtons, IonIcon, IonMenu, IonList, IonItem, IonLabel, IonSplitPane, IonMenuButton, IonRouterOutlet } from '@ionic/angular/standalone';
import { MenuController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { home, personCircle, star, chatbubbles, logOut, map } from 'ionicons/icons';
import { AuthService } from '../../../core/auth/services/auth.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-pro-layout',
  standalone: true,
  imports: [
    CommonModule, RouterLink,
    IonContent, IonHeader, IonToolbar, IonTitle, IonButton, IonButtons, IonIcon,
    IonMenu, IonList, IonItem, IonLabel, IonSplitPane, IonMenuButton, IonRouterOutlet
  ],
  templateUrl: './pro-layout.component.html',
  styleUrl: './pro-layout.component.css'
})
export class ProLayoutComponent {
  constructor(
    private auth: AuthService,
    private menuController: MenuController,
    private router: Router
  ) {
    addIcons({ home, personCircle, star, chatbubbles, logOut, map });

    // Cerrar el menú cuando cambia la ruta
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.closeMenu();
      });
  }

  closeMenu() {
    // Forzar el cierre del menú de múltiples maneras
    this.menuController.close('main-menu');
    this.menuController.close();
    // También intentar cerrar después de un pequeño delay por si acaso
    setTimeout(() => {
      this.menuController.close('main-menu');
      this.menuController.close();
    }, 100);
  }

  logout() {
    this.closeMenu();
    this.auth.logout();
  }
}


