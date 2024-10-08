import { Equipment } from '@app/pages/assetsMain/assets/assets-model';
import { createAction, props } from '@ngrx/store';

export const updateDrawer = createAction(
  '[Drawer] Update Drawer',
  props<{ drawerOpen:boolean, drawerAction:"Create"|"Edit", drawerInfo:Equipment|null|undefined|any,needReload: boolean}>()
);