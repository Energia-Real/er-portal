import { FilterState, GeneralFilters } from '@app/shared/models/general-models';
import { createAction, props } from '@ngrx/store';

export const setFilters = createAction(
  '[Filter] Set Filters',
  props<{ filters: GeneralFilters }>()
);

export const setGeneralFilters = createAction(
  '[Filter] Set Filters General',
  props<{ generalFilters: GeneralFilters }>()
);

export const setFiltersBatu = createAction(
  '[Filter] Set Filters Batu',
  props<{ filtersBatu: GeneralFilters }>()
);

export const setFiltersSolarCoverage = createAction(
  '[Filter] Set Filters Solar Coverage',
  props<{ filtersSolarCoverage: GeneralFilters }>()
);