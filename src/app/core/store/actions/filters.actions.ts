import { FilterState } from '@app/shared/models/general-models';
import { createAction, props } from '@ngrx/store';

export const setFilters = createAction(
  '[Filter] Set Filters',
  props<{ filters: FilterState }>()
);
