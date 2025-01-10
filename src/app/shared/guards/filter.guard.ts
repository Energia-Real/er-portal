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
    // private store: Store<{ filters: FilterState}>,
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
  
        const currentUrl = state.url; // Obtenemos la URL actual (sin parámetros de consulta)
  
        console.log(currentUrl);
        console.log(this.route);
        
        // Si los filtros están definidos, los añadimos a los parámetros de consulta
        if (generalFilters?.generalFilters?.startDate && generalFilters?.generalFilters?.endDate) {
          const newParams = {
            startday: generalFilters.generalFilters.startDate,
            endday: generalFilters.generalFilters.endDate,
          };
  
          // Usamos this.router.navigate para mantener otros parámetros en la URL
          this.router.navigate([], {
            relativeTo: this.route,
            queryParams: newParams,
            queryParamsHandling: 'merge', // Asegura que otros parámetros de la URL se mantengan
          });
  
          // Evitamos la navegación directa (no redirigimos hasta que se actualicen los parámetros)
          return false;
        }
  
        // Si no hay filtros, permitimos la navegación normal
        return true;
      })
    );
  }
}

