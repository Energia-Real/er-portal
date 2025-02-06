import { FilterState, GeneralFilters } from '@app/shared/models/general-models';
import { createSelector, createFeatureSelector } from '@ngrx/store';

export const selectFilterState = createFeatureSelector<GeneralFilters>('filters');

export const selectFilters = createSelector(
  selectFilterState,
  (state: GeneralFilters) => state
);
