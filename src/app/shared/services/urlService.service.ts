import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { FilterState, GeneralFilters } from '../models/general-models';
import { distinctUntilChanged } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UrlSyncService {
  constructor(private router: Router, private store: Store<{ filters: FilterState }>) {}

  syncFiltersWithUrl() {
    this.store
      .select((state) => state.filters.generalFilters)
      .pipe(distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)))
      .subscribe((filters: GeneralFilters) => {
        const currentUrl = this.router.url.split('?')[0]; // Obtener solo la ruta base sin parámetros
        const queryParams = {
          startday: filters.startDate,
          endday: filters.endDate,
        };

        this.router.navigate([currentUrl], { queryParams });
      });
  }
}
