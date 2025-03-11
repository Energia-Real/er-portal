import { GeneralFilters } from '@app/shared/models/general-models';
import { createAction, props } from '@ngrx/store';

export const setGeneralFilters = createAction(
  '[Filter] Set Filters General',
  props<{ generalFilters: GeneralFilters }>()
);