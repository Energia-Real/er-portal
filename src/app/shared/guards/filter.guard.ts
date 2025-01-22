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
        // http://localhost:9000/er/admin-home?startday=2025-01-01&endday=2025-05-01
        // http://localhost:9000/er/plants/details/7431515e-3fa7-4a01-a1c0-66a3d3f4f072?startday=2025-01-01&endday=2025-05-01
        // http://localhost:9000/er/plants/details/7431515e-3fa7-4a01-a1c0-66a3d3f4f072%3Fstartday%3D2025-01-01&endday%3D2025-05-01?returnUrl=%2Fer%2Fplants%2Fdetails%2F7431515e-3fa7-4a01-a1c0-66a3d3f4f072%3Fstartday%3D2025-01-01%26endday%3D2025-05-01&startday=2025-01-01&endday=2025-05-01

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
