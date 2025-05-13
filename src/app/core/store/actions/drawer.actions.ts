import { Equipment } from '@app/pages/plants-main/plants-model';
import { createAction, props } from '@ngrx/store';

export const updateDrawer = createAction(
  '[Drawer] Update Drawer',
  props<{ drawerOpen: boolean, drawerAction: "Create" | "Edit" | "View", drawerInfo: Equipment | null | undefined | any, needReload: boolean }>()
);

export const corporateDrawer = createAction(
  '[CorporateDrawer] Corporate Drawer',
  props<{ drawerOpen: boolean, clientId: string, clientName: string }>()
);