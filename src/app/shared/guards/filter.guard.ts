import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { selectFilterState } from '@app/core/store/selectors/filters.selector';
import { GeneralFilters } from '../models/general-models';

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
      map((generalFilters: GeneralFilters) => {
        const { startDate, endDate } = generalFilters;
        const startDateParts = startDate.split('-');
        const endDateParts = endDate.split('-');

        let startDayYear = startDateParts[0]; 
        let endDayYear = endDateParts[0];

        const startday = startDate;
        const endday = `${endDayYear}-${endDateParts[1]}-${endDateParts[2]}`;

        const currentUrl: string = state.url.split('?')[0];
        const currentParams = new URLSearchParams(route.queryParams as any);
        const newParams = new URLSearchParams(currentParams);

        if (startday !== currentParams.get('startday')) newParams.set('startday', startday);
        if (endday !== currentParams.get('endday')) newParams.set('endday', endday);

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
