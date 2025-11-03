import { Routes } from '@angular/router';
import { authGuard, professionalGuard } from './core/auth/guards/auth.guard';
import { HomeComponent } from './features/home/home';
import { ProfessionalsComponent } from './features/professionals/pages/professionals-list/professionals';
import { ProfessionalDetailComponent } from './features/professionals/pages/professional-detail/professional-detail';
import { RegisterProfessionalComponent } from './features/register-professional/register-professional';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'professionals', component: ProfessionalsComponent },
  { path: 'professionals/:id', component: ProfessionalDetailComponent },
  { path: 'register-professional', component: RegisterProfessionalComponent },
  { path: 'login', loadComponent: () => import('./core/auth/components/login/login.component').then(m => m.LoginComponent) },
  { path: 'forgot-password', loadComponent: () => import('./core/auth/components/forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent) },
  {
    path: 'panel',
    canActivate: [authGuard, professionalGuard],
    loadChildren: () => import('./features/pro-dashboard/pro-dashboard.routes').then(m => m.PRO_DASHBOARD_ROUTES)
  },
  { path: '**', redirectTo: '' }
];
