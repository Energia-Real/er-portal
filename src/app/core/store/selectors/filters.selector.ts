import { FilterState } from '@app/shared/models/general-models';
import { createSelector, createFeatureSelector } from '@ngrx/store';

export const selectFilterState = createFeatureSelector<FilterState>('filters');

export const selectFilters = createSelector(
  selectFilterState,
  (state: FilterState) => state.filters
);
