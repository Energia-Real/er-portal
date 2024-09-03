import { FilterState, initialFilterState } from '@app/shared/models/general-models';
import { createReducer, on } from '@ngrx/store';
import { setFilters } from '../actions/filters.actions';
// import { setFilters } from '../actions/filter.actions';
// import { initialFilterState, FilterState } from '../models/filter.model';

const _filterReducer = createReducer(
  initialFilterState,
  on(setFilters, (state, { filters }) => ({ ...state, ...filters }))
);

export function filterReducer(state: FilterState | undefined, action: any) {
  return _filterReducer(state, action);
}
