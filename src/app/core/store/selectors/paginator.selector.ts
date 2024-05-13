import { createSelector, createFeatureSelector } from '@ngrx/store';
import { PaginatorState } from '../reducers/paginator.reducer';

export const selectPaginator = createFeatureSelector<PaginatorState>('paginator');

export const selectPageIndex = createSelector(
  selectPaginator,
  state => state.pageIndex
);

export const selectPageSize = createSelector(
  selectPaginator,
  state => state.pageSize
);
