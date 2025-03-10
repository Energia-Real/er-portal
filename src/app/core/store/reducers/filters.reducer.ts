import { GeneralFilters, initialFilterState } from '@app/shared/models/general-models';
import { createReducer, on } from '@ngrx/store';
import { setGeneralFilters } from '../actions/filters.actions';

const _filterReducer = createReducer(
  initialFilterState,
  on(setGeneralFilters, (state, generalFilters) => ({ ...state, ...generalFilters.generalFilters })),
);

export function filterReducer(state: GeneralFilters | undefined, action: any) {
  return _filterReducer(state, action);
}