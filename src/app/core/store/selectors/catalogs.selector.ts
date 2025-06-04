import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CatalogsState } from '../reducers/catalogs.reducer';

export const selectCatalogsState = createFeatureSelector<CatalogsState>('catalogs');

export const selectClients = createSelector(
  selectCatalogsState,
  (state) => state.clients
);

export const selectLegalNames = createSelector(
  selectCatalogsState,
  (state) => state.legalNames
);

export const selectProducts = createSelector(
  selectCatalogsState,
  (state) => state.products
);

export const selectClientsIndividual = createSelector(
  selectCatalogsState,
  (state) => state.clientsIndividual
);