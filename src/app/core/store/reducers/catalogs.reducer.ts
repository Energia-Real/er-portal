import { createReducer, on } from '@ngrx/store';
import * as CatalogActions from '../actions/catalogs.actions';

export interface CatalogsState {
  clients: any[];
  legalNames: any[];
  products: any[];
  error: string | null;

  clientsIndividual: any[];
  clientsIndividualError: string | null;
}

export const initialState: CatalogsState = {
  clients: [],
  legalNames: [],
  products: [],
  error: null,
  clientsIndividual: [],
  clientsIndividualError: null,
};

export const catalogsReducer = createReducer(
  initialState,

 // Para catálogo unificado
on(CatalogActions.loadAllCatalogsSuccess, (state, { clients, legalNames, products }) => ({
  ...state,
  clients,
  legalNames,
  products,
  error: null
})),
on(CatalogActions.loadAllCatalogsFailure, (state, { error }) => ({
  ...state,
  error
})),

// Para catálogo individual clients
on(CatalogActions.loadClientsCatalogSuccess, (state, { clients }) => ({
  ...state,
  clientsIndividual: clients,
  clientsIndividualError: null
})),
on(CatalogActions.loadClientsCatalogFailure, (state, { error }) => ({
  ...state,
  clientsIndividualError: error
})),


  // Aquí podrías agregar individualmente 
);
