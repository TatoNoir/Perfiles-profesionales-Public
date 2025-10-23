import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home';
import { ProfessionalsComponent } from './pages/professionals/professionals';
import { ProfessionalDetailComponent } from './pages/professional-detail/professional-detail';
import { RegisterProfessionalComponent } from './pages/register-professional/register-professional';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'professionals', component: ProfessionalsComponent },
  { path: 'professionals/:id', component: ProfessionalDetailComponent },
  { path: 'register-professional', component: RegisterProfessionalComponent },
  { path: '**', redirectTo: '' }
];
