import { createReducer, on } from '@ngrx/store';
import { updatePagination } from '../actions/paginator.actions';

export interface PaginatorState {
  pageIndex: number;
  pageSize: number;
}

export const initialState: PaginatorState = {
  pageIndex: 0,
  pageSize: 5,
};

export const paginatorReducer = createReducer(
  initialState,
  on(updatePagination, (state, { pageIndex, pageSize }) => ({
    pageIndex,
    pageSize
  }))
);
