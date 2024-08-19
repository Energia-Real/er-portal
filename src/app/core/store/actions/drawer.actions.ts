import { Equipment } from '@app/pages/paymets-main/payments-model';
import { createAction, props } from '@ngrx/store';

export const updateDrawer = createAction(
  '[Drawer] Update Drawer',
  props<{ drawerOpen:boolean, drawerAction:"Create"|"Edit", drawerInfo:Equipment|null|undefined}>()
);