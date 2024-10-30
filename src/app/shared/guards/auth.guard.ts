import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '@app/auth/auth.service';


export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  const user = authService.userValue;

  if (user) {
    return true;
  }

  router.navigate(['/account/login'], { queryParams: { returnUrl: state.url }});
  return false;
};
