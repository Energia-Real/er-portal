import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { selectFilterState } from '@app/core/store/selectors/filters.selector';

@Injectable({
  providedIn: 'root'
})
export class FilterGuard implements CanActivate {
  constructor(
    private store: Store,
    private router: Router,
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.store.select(selectFilterState).pipe(
      map((generalFilters: any) => {
        const { startDate, endDate } = generalFilters.generalFilters;
        const startDayYear: number = startDate.split('-')[0];
        const endDayYear: number = endDate.split('-')[0];
        const currentUrl: string = state.url.split('?')[0];
        const currentParams = new URLSearchParams(route.queryParams as any);
        const startday: string = startDate;
        const endday: string = endDate;
        const newParams = new URLSearchParams(currentParams);

        if ((startDayYear == 2024 || startDayYear == 2025) && (endDayYear == 2024 || endDayYear == 2025)) {
          // Si startday ha cambiado o no está en la URL, lo actualizamos
          if (startday !== currentParams.get('startday')) newParams.set('startday', startday);
          // Si endday ha cambiado o no está en la URL, lo actualizamos
          if (endday !== currentParams.get('endday')) newParams.set('endday', endday);

        } else {
          newParams.set('startday', '2024-01-01');
          newParams.set('endday', '2024-01-31');
        }

        const newUrl = `${currentUrl}?${newParams.toString()}`;

        if (state.url !== newUrl) {
          this.router.navigateByUrl(newUrl);
          return false;
        }

        return true;
      })
    );
  }
}
