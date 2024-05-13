import { createAction, props } from '@ngrx/store';

export const updatePagination = createAction(
  '[Paginator] Update Pagination',
  props<{ pageIndex: number, pageSize: number }>()
);