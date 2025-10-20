import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home';
import { ProfessionalsComponent } from './pages/professionals/professionals';
import { ProfessionalDetailComponent } from './pages/professional-detail/professional-detail';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'professionals', component: ProfessionalsComponent },
  { path: 'professionals/:id', component: ProfessionalDetailComponent },
  { path: '**', redirectTo: '' }
];
