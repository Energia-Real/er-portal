import { createAction, props } from '@ngrx/store';

// Unificados en un servicio
export const loadAllCatalogs = createAction('[Catalogs] Load All');

export const loadAllCatalogsSuccess = createAction(
  '[Catalogs] Load All Success',
  props<{
    clients: any[];
    legalNames: any[];
    products: any[];
  }>()
);

export const loadAllCatalogsFailure = createAction(
  '[Catalogs] Load All Failure',
  props<{ error: string }>()
);

// Individuales ejemplo clients
export const loadClientsCatalog = createAction('[Catalog] Load Clients');
export const loadClientsCatalogSuccess = createAction(
  '[Catalog] Load Clients Success',
  props<{ clients: any[] }>()
);
export const loadClientsCatalogFailure = createAction(
  '[Catalog] Load Clients Failure',
  props<{ error: string }>()
);
