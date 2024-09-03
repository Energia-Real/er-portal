import { createSelector, createFeatureSelector } from '@ngrx/store';
import { DateState } from '../reducers/filters.reducer';

export const selectDateState = createFeatureSelector<DateState>('date');

export const selectSelectedDate = createSelector(
  selectDateState,
  (state: DateState) => state.selectedDate
);

export const selectSelectedMonths = createSelector(
  selectDateState,
  (state: DateState) => state.selectedMonths

);
