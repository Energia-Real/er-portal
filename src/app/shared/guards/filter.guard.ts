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
        let currentParams:any
        const currentUrl = state.url.split('?')[0];
        currentParams = new URLSearchParams(window.location.search); 
        console.log(currentParams);
        
        if (!currentParams) {
          currentParams = new URLSearchParams(generalFilters.generalFilters); 

        }

        console.log(currentParams);
        
  
        const startday = generalFilters.generalFilters.startDate;
        const endday = generalFilters.generalFilters.endDate;
  
          const newParams = new URLSearchParams(currentParams);
  
  
          // Si startday ha cambiado o no está en la URL, lo actualizamos
          if (startday !== currentParams.get('startday')) {
            newParams.set('startday', startday);
          }
  
          // Si endday ha cambiado o no está en la URL, lo actualizamos
          if (endday !== currentParams.get('endday')) {
            newParams.set('endday', endday);
          }
  
          // Si la URL fue modificada, la actualizamos
          // if (updated) {
            const newUrl = `${currentUrl}?${newParams.toString()}`;
  
            // Redirigimos solo si la URL ha cambiado
            if (state.url !== newUrl) {
              console.log('Redirigiendo a nueva URL:', newUrl);
  
              // Usamos setTimeout para asegurar que la navegación de Angular se complete
              // setTimeout(() => {
                this.router.navigateByUrl(newUrl); // Realizamos la navegación
              // }, 500);
  
              return false; 
            }

  
        // Si no hubo cambios, permitimos la navegación
        return true;
      })
    );
  }
  
  
  
  
  
  
  
  

  
}
