import { FilterState } from '@app/shared/models/general-models';
import { createAction, props } from '@ngrx/store';

export const setFilters = createAction(
  '[Filter] Set Filters',
  props<{ filters: FilterState['filters'] }>()
);

export const setGeneralFilters = createAction(
  '[Filter] Set Filters',
  props<{ generalFilters: FilterState['generalFilters'] }>()
);

export const setFiltersBatu = createAction(
  '[Filter] Set Filters Batu',
  props<{ filtersBatu: FilterState['filtersBatu'] }>()
);

export const setFiltersSolarCoverage = createAction(
  '[Filter] Set Filters Solar Coverage',
  props<{ filtersSolarCoverage: FilterState['filtersSolarCoverage'] }>()
);