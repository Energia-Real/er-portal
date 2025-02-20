import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '@app/auth/auth.service';
import { setGeneralFilters } from '@app/core/store/actions/filters.actions';
import { Store } from '@ngrx/store';
import { GeneralFilters } from '../models/general-models';
import { Observable, take, map } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const store = inject(Store);
  const authService = inject(AuthService);
  const user = authService.userValue;

  // Seleccionar el estado de los filtros
  const generalFilters$: Observable<GeneralFilters> = store.select(state => state.filters.generalFilters);

  return generalFilters$.pipe(
    take(1),
    map((generalFilters: GeneralFilters) => {
      // Validar si los filtros no están definidos
      if (!generalFilters.startDate || !generalFilters.endDate) {
        const url = new URL(window.location.origin + state.url);
        const startday = url.searchParams.get('startday');
        const endday = url.searchParams.get('endday');
        const year = url.searchParams.get('year');
  
        const getLastDayOfMonth = (dateStr: string): string => {
          const date = new Date(dateStr);
          const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0); 
          return lastDay.toISOString().split('T')[0];
        };
  
        const endDate = endday ? getLastDayOfMonth(endday) : '2025-05-31'; 
  
        const newFilters: GeneralFilters = {
          startDate: startday ?? '2025-01-01',
          endDate,
          year: year ?? '2024',
        };
  
        // Despachar los nuevos filtros al store
        store.dispatch(setGeneralFilters({ generalFilters: newFilters }));
      }
  
      // Validar si el usuario está autenticado
      if (user) return true;
  
      router.navigate(['']);
      return false;
    })
  );
};
