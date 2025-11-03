import { Routes } from '@angular/router';
import { ProLayoutComponent } from './layout/pro-layout.component';

export const PRO_DASHBOARD_ROUTES: Routes = [
  {
    path: '',
    component: ProLayoutComponent,
    children: [
      { path: '', redirectTo: 'inicio', pathMatch: 'full' },
      { path: 'inicio', loadComponent: () => import('./pages/overview/overview.component').then(m => m.OverviewComponent), title: 'Dashboard' },
      { path: 'mi-perfil', loadComponent: () => import('./pages/profile/profile.component').then(m => m.ProfileComponent), title: 'Mi Perfil' },
      { path: 'zonas', loadComponent: () => import('./pages/zones/zones.component').then(m => m.ZonesComponent), title: 'Zonas de Trabajo' },
      { path: 'valoraciones', loadComponent: () => import('./pages/reviews/reviews.component').then(m => m.ReviewsComponent), title: 'Valoraciones' },
      { path: 'preguntas', loadComponent: () => import('./pages/qa/qa.component').then(m => m.QaComponent), title: 'Preguntas y Respuestas' }
    ]
  }
];


