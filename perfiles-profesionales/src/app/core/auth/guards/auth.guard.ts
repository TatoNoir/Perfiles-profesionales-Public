import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (auth.isAuthenticated()) return true;
  router.navigate(['/login']);
  return false;
};

export const professionalGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  // Verificar que esté autenticado y que sea un profesional (user_type_id === 2)
  if (auth.isAuthenticated()) {
    return true;
  }

  // Si no está autenticado o no es profesional, redirigir a login
  router.navigate(['/login']);
  return false;
};


