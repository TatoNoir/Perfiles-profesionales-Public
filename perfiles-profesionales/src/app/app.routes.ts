import { Routes } from '@angular/router';
import { authGuard, professionalGuard } from './auth/guards/auth.guard';
import { HomeComponent } from './components/home/home';
import { ProfessionalsComponent } from './pages/professionals/professionals';
import { ProfessionalDetailComponent } from './pages/professional-detail/professional-detail';
import { RegisterProfessionalComponent } from './pages/register-professional/register-professional';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'professionals', component: ProfessionalsComponent },
  { path: 'professionals/:id', component: ProfessionalDetailComponent },
  { path: 'register-professional', component: RegisterProfessionalComponent },
  { path: 'login', loadComponent: () => import('./auth/components/login/login.component').then(m => m.LoginComponent) },
  { path: 'forgot-password', loadComponent: () => import('./auth/components/forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent) },
  {
    path: 'panel',
    canActivate: [authGuard, professionalGuard],
    loadChildren: () => import('./pro-dashboard/pro-dashboard.routes').then(m => m.PRO_DASHBOARD_ROUTES)
  },
  { path: '**', redirectTo: '' }
];
