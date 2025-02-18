import { createSelector, createFeatureSelector } from '@ngrx/store';
import { DrawerState } from '../reducers/drawer.reducer';
import { CorporateDrawerState } from '../reducers/drawer.reducer';

export const selectDrawer = createFeatureSelector<DrawerState>('drawer');

export const selectCorporateDrawer = createFeatureSelector<CorporateDrawerState>('corporateDrawer');


export const selecDrawerOpen = createSelector(
  selectDrawer,
  state => state.drawerOpen
);

export const selecDrawerAction = createSelector(
  selectDrawer,
  state => state.drawerAction
);

export const selecDrawerInfo= createSelector(
  selectDrawer,
  state => state.drawerInfo
);

export const needReload= createSelector(
  selectDrawer,
  state => state.needReload
);


export const selectCorporateClient = createSelector(
  selectCorporateDrawer,
  state => state.clientId
);

export const selectClientName = createSelector(
  selectCorporateDrawer,
  state => state.clientName
);