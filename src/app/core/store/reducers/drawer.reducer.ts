import { createReducer, on } from '@ngrx/store';
import { corporateDrawer, updateDrawer } from '../actions/drawer.actions';
import { Equipment } from '@app/pages/plants-main/plants-model';

export interface DrawerState {
  drawerOpen: boolean;
  drawerAction: "Create"|"Edit",
  drawerInfo: Equipment | null | undefined,
  needReload: boolean
}

export interface CorporateDrawerState {
  drawerOpen: boolean;
  clientId: null|string; 
  clientName: null|string
}

export const initialState: DrawerState = {
  drawerOpen :  false,
  drawerAction: "Create",
  drawerInfo: null,
  needReload: false
};

export const corporateInitialState: CorporateDrawerState = {
  drawerOpen :  false,
  clientId : null,
  clientName: null
};

export const drawerReducer = createReducer(
  initialState,
  on(updateDrawer, (state, { drawerOpen, drawerAction, drawerInfo,needReload}) => ({
   drawerOpen,drawerAction,drawerInfo,needReload
  }))
);

export const corporateDrawerReducer = createReducer(
  corporateInitialState,
  on(corporateDrawer, (state, { drawerOpen, clientId, clientName}) => ({
   drawerOpen, clientId,clientName
  }))
);
