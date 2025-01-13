import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '@app/auth/auth.service';
import { setGeneralFilters } from '@app/core/store/actions/filters.actions';
import { Store } from '@ngrx/store';
import { FilterState, GeneralFilters } from '../models/general-models';
import { Observable } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const store = inject(Store);
  const authService = inject(AuthService);
  const user = authService.userValue;
  let generalFilters$!: Observable<FilterState['generalFilters']>;
  generalFilters$ = store.select(state => state.filters.generalFilters);


  generalFilters$.subscribe((generalFilters: GeneralFilters) => {
    if (!generalFilters.startDate && !generalFilters.endDate) {
      const url = new URL(window.location.origin + state.url);
      const startday = url.searchParams.get('startday');
      const endday = url.searchParams.get('endday');

      if (startday && endday) {
        generalFilters = {
          startDate: startday,
          endDate: endday
        };

      } else {
        generalFilters = {
          startDate: '2025-01-01',
          endDate: '2025-05-01'
        };
      }
      store.dispatch(setGeneralFilters({ generalFilters }));
    }
  });

  if (user) return true;

  router.navigate([''], { queryParams: { returnUrl: state.url } });

  return false;
};
