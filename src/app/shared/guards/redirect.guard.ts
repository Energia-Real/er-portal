import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '@app/auth/auth.service';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export const redirectGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const expectedRoles = route.data['roles'];

  return authService.getInfoUser().pipe(
    map(userInfo => {
      return true;
    }),
    catchError(() => {
      router.navigate(['/login']);
      return of(false);
    })
  );
};
