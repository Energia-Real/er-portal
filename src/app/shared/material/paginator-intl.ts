import { MatPaginatorIntl } from '@angular/material/paginator';

export function getPaginatorIntl(): MatPaginatorIntl {
  const paginatorIntl = new MatPaginatorIntl();
  
  paginatorIntl.getRangeLabel = (page: number, pageSize: number, length: number) => {
    const totalPages = Math.ceil(length / pageSize);
    return `${page + 1} of ${totalPages}`;
  };

  return paginatorIntl;
}
