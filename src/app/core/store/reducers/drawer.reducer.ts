import { createReducer, on } from '@ngrx/store';
import { updateDrawer } from '../actions/drawer.actions';
import { Equipment } from '@app/pages/paymets-main/payments-model';

export interface DrawerState {
  drawerOpen: boolean;
  drawerAction: "Create"|"Edit",
  drawerInfo: Equipment | null | undefined
}

export const initialState: DrawerState = {
  drawerOpen :  false,
  drawerAction: "Create",
  drawerInfo: null
};

export const drawerReducer = createReducer(
  initialState,
  on(updateDrawer, (state, { drawerOpen, drawerAction, drawerInfo}) => ({
   drawerOpen,drawerAction,drawerInfo
  }))
);
