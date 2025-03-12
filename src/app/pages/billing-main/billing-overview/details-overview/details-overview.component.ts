import { Component, Input, ViewChild } from '@angular/core';
import { combineLatest, distinctUntilChanged, Subject, takeUntil } from 'rxjs';
import { BillingService } from '../../billing.service';
import { Store } from '@ngrx/store';
import { updateDrawer } from '@app/core/store/actions/drawer.actions';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { updatePagination } from '@app/core/store/actions/paginator.actions';
import * as entity from '../../billing-model';
import { selectPageIndex, selectPageSize } from '@app/core/store/selectors/paginator.selector';

@Component({
  selector: 'app-details-overview',
  templateUrl: './details-overview.component.html',
  styleUrl: './details-overview.component.scss'
})
export class DetailsOverviewComponent {
  private onDestroy$ = new Subject<void>();

  dataSource = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;
  pageSizeOptions: number[] = [5, 10, 20, 50];
  pageSize: number = 10;
  pageIndex: number = 1;
  totalItems: number = 0;
  displayedColumns: string[] = [
    'subClient',
    'rate',
    'production',
    'totalAmount',
  ];

  billingData!: entity.DataBillingOverviewTable | any;
  billingDetails!: entity.DataDetailsOverviewTable | any;

  @Input() isOpen = false;
  @Input() modeDrawer: "Edit" | "Create" = "Create";
  @Input() set billing(data: entity.DataBillingOverviewTable | null | undefined) {
    if (data) {
      this.billingData = data;
      // this.getBillingDetails()
    }
  }

  constructor(
    private moduleServices: BillingService,
    private store: Store,
  ) {
    combineLatest([
      this.store.select(selectPageSize).pipe(distinctUntilChanged()),
      this.store.select(selectPageIndex).pipe(distinctUntilChanged())
    ])
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(([pageSize, pageIndex]) => {
        this.pageSize = pageSize;
        this.pageIndex = pageIndex + 1;

        if (this.paginator) {
          this.paginator.pageSize = pageSize;
          this.paginator.pageIndex = pageIndex;
        }

        // this.getBillingDetails();
      });
  }

  getBillingDetails() {
    const filters: any = {
      pageSize: this.pageSize,
      page: this.pageIndex,
      year: this.billingData?.year,
      month: this.billingData?.month,
      rfc: this.billingData?.rfc
    };

    this.moduleServices.getBillingDetails(filters).subscribe({
      next: (response: entity.DataDetailsOverviewTableMapper) => {
        this.dataSource.data = response.dataPlants!;
        this.billingDetails = response.data[0];
        this.totalItems = response?.totalItems;
        this.pageIndex = filters.page;
        this.dataSource.sort = this.sort;
      },
      error: error => {
        console.log(error);
      }
    });
  }

  changePageSize(event: any) {
    const newSize = event.value;
    this.pageSize = newSize;

    if (this.paginator) {
      this.paginator.pageSize = newSize;
      this.paginator._changePageSize(newSize);
    }

    this.getBillingDetails();
  }

  cancelEdit() {
    this.billingData = null;
    this.billingDetails = null
    this.dataSource.data = [];
    this.totalItems = 0;
    this.pageIndex = 1;
    this.pageSize = 10;

    if (this.paginator) {
      this.paginator.pageIndex = 0;
      this.paginator.pageSize = this.pageSize;
    }
  }

  closeDrawer(reload: boolean) {
    this.cancelEdit();
    this.isOpen = false;

    this.store.dispatch(updateDrawer({
      drawerOpen: false,
      drawerAction: "Create",
      drawerInfo: null,
      needReload: reload
    }));
  }

  getServerData(event: PageEvent): void {
    if (event.pageSize !== this.pageSize || event.pageIndex !== this.pageIndex - 1) {
      this.store.dispatch(updatePagination({ pageIndex: event.pageIndex, pageSize: event.pageSize }));
    }
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.unsubscribe();
  }
}
