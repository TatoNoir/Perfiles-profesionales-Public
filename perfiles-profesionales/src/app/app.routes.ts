import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home';
import { ProfessionalsComponent } from './pages/professionals/professionals';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'professionals', component: ProfessionalsComponent },
  { path: '**', redirectTo: '' }
];
