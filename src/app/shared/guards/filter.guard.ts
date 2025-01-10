import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GeneralFilters } from '../models/general-models';
import { selectFilterState } from '@app/core/store/selectors/filters.selector';

@Injectable({
  providedIn: 'root'
})
export class FilterGuard implements CanActivate {
  constructor(
    private store: Store,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.store.select(selectFilterState).pipe(
      map((generalFilters: any) => {
        console.log('generalFilters', generalFilters.generalFilters);

        const currentUrl = state.url;
        const currentParams = new URLSearchParams(window.location.search); 

        const startday = generalFilters.generalFilters.startDate;
        const endday = generalFilters.generalFilters.endDate;

        if (startday && endday && (!currentParams.has('startday') || !currentParams.has('endday'))) {
          currentParams.set('startday', startday);
          currentParams.set('endday', endday);

          const newUrl = `${currentUrl.split('?')[0]}?${currentParams.toString()}`; 

          if (state.url !== newUrl) {
            this.router.navigateByUrl(newUrl);
            return false; 
          }
        }

        return true;
      })
    );
  }
}
