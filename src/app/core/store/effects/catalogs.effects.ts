import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of, withLatestFrom, filter, Observable } from 'rxjs';
import * as CatalogActions from '../actions/catalogs.actions';
import { GlobalFiltersService } from '@app/shared/components/global-filters/global-filters.service';
import { Store } from '@ngrx/store';
import { selectClients, selectClientsIndividual, selectLegalNames, selectProducts } from '../selectors/catalogs.selector';

@Injectable()
export class CatalogEffects {
  constructor(
    private actions$: Actions,
    private store: Store,
    private globalFiltersService: GlobalFiltersService
  ) { }

  loadAllCatalogs$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CatalogActions.loadAllCatalogs),
      withLatestFrom(
        this.store.select(selectClients) as Observable<any[]>,
        this.store.select(selectLegalNames) as Observable<any[]>,
        this.store.select(selectProducts) as Observable<any[]>
      ),
      // solo ejecuta si alguno está vacío
      filter(([action, clients, legalNames, products]) =>
        (!clients || clients.length === 0) ||
        (!legalNames || legalNames.length === 0) ||
        (!products || products.length === 0)
      ),
      mergeMap(() =>
        this.globalFiltersService.getCatalogsBillingDetails().pipe(
          map(response =>
            CatalogActions.loadAllCatalogsSuccess({
              clients: response.clientes,
              legalNames: response.razonesSociales,
              products: response.tiposProyecto
            })
          ),
          catchError(err =>
            of(CatalogActions.loadAllCatalogsFailure({ error: err.message }))
          )
        )
      )
    )
  );

  loadClientsCatalog$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CatalogActions.loadClientsCatalog),
      withLatestFrom(
        this.store.select(selectClientsIndividual) as Observable<any[]>
      ),
      filter(([action, clientsIndividual]) => !clientsIndividual || clientsIndividual.length === 0),
      mergeMap(() =>
        this.globalFiltersService.getClients().pipe(
          map(clients =>
            CatalogActions.loadClientsCatalogSuccess({ clients })
          ),
          catchError(err =>
            of(CatalogActions.loadClientsCatalogFailure({ error: err.message }))
          )
        )
      )
    )
  );
}
