import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, ActivatedRoute } from '@angular/router';
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
    private route: ActivatedRoute
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.store.select(selectFilterState).pipe(
      map((generalFilters: any) => {
        let currentParams: any
        const currentUrl = state.url.split('?')[0];
        currentParams = new URLSearchParams(window.location.search);

        if (!currentParams) currentParams = new URLSearchParams(generalFilters.generalFilters);

        const startday = generalFilters.generalFilters.startDate;
        const endday = generalFilters.generalFilters.endDate;
        const newParams = new URLSearchParams(currentParams);

        // Si startday ha cambiado o no está en la URL, lo actualizamos
        if (startday !== currentParams.get('startday')) newParams.set('startday', startday);
        // Si endday ha cambiado o no está en la URL, lo actualizamos
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
