import { createReducer, on } from '@ngrx/store';
import { updateDrawer } from '../actions/drawer.actions';
import { Equipment } from '@app/pages/plants-main/plants-model';

export interface DrawerState {
  drawerOpen: boolean;
  drawerAction: "Create"|"Edit",
  drawerInfo: Equipment | null | undefined,
  needReload: boolean
}

export const initialState: DrawerState = {
  drawerOpen :  false,
  drawerAction: "Create",
  drawerInfo: null,
  needReload: false
};

export const drawerReducer = createReducer(
  initialState,
  on(updateDrawer, (state, { drawerOpen, drawerAction, drawerInfo,needReload}) => ({
   drawerOpen,drawerAction,drawerInfo,needReload
  }))
);
