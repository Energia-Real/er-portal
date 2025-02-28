import { FilterState, initialFilterState } from '@app/shared/models/general-models';
import { createReducer, on } from '@ngrx/store';
import { setFilters, setFiltersBatu, setFiltersSolarCoverage, setGeneralFilters } from '../actions/filters.actions';

const _filterReducer = createReducer(
  initialFilterState,
  on(setGeneralFilters, (state, { generalFilters }) => ({ ...state, generalFilters })),
);

export function filterReducer(state: FilterState | undefined, action: any) {
  return _filterReducer(state, action);
}