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
    console.log(generalFilters);
    

    if (!generalFilters.startDate && !generalFilters.endDate) {
      // Parseamos los parámetros de la URL desde state.url

      const url = new URL(window.location.origin + state.url);
      const startday = url.searchParams.get('startday');
      const endday = url.searchParams.get('endday');

      if (startday && endday) {
        const generalFilters: GeneralFilters = {
          startDate: startday,
          endDate: endday
        };

        // Actualizar los filtros en el estado(NgRx)
        store.dispatch(setGeneralFilters({ generalFilters }));
      }
    } else {
      console.log('YA SE AN GUARDADO LOS');
    }
  });

  if (user) return true;

  router.navigate([''], { queryParams: { returnUrl: state.url } });

  return false;
};
