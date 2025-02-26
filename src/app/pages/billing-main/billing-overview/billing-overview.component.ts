import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import * as entity from '../billing-model';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DrawerGeneral, FilterState, GeneralFilters, UserInfo } from '@app/shared/models/general-models';
import { EncryptionService } from '@app/shared/services/encryption.service';
import { Store } from '@ngrx/store';
import { combineLatest, distinctUntilChanged, Observable, Subject, Subscription, takeUntil } from 'rxjs';
import { BillingService } from '../billing.service';
import { selectPageIndex, selectPageSize } from '@app/core/store/selectors/paginator.selector';
import { updatePagination } from '@app/core/store/actions/paginator.actions';
import { updateDrawer } from '@app/core/store/actions/drawer.actions';
import { selectDrawer } from '@app/core/store/selectors/drawer.selector';

@Component({
  selector: 'app-billing-overview',
  templateUrl: './billing-overview.component.html',
  styleUrl: './billing-overview.component.scss'
})
export class BillingOverviewComponent {
  private onDestroy$ = new Subject<void>();

  generalFilters$!: Observable<FilterState['generalFilters']>;

  dataSourceBilling = new MatTableDataSource<any>([]);
  dataSourceHistory = new MatTableDataSource<any>([]);
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;
  pageSizeOptions: number[] = [5, 10, 20, 50];
  pageSizeBilling: number = 10;
  pageIndexBilling: number = 1;
  totalItemsBilling: number = 0;
  displayedColumnsBilling: string[] = [
    'corporateName',
    'month',
    'year',
    'amount',
    'actions'
  ];
  pageSizeHistory: number = 10;
  pageIndexHistory: number = 1;
  totalItemsHistory: number = 0;
  displayedColumnsHistory: string[] = [
    'corporateName',
    'month',
    'year',
    'amount',
    'actions'
  ];
  pageSizeSub!: Subscription;
  pageIndexSub!: Subscription;

  drawerOpen: boolean = false;
  drawerAction: "Create" | "Edit" = "Create";
  drawerInfo: any | null | undefined = null;
  drawerOpenSub: Subscription;

  generalFilters!: GeneralFilters
  userInfo!: UserInfo;

  dataBilling: any

  constructor(
    private store: Store<{ filters: FilterState }>,
    public dialog: MatDialog,
    private encryptionService: EncryptionService,
    private moduleServices: BillingService,
  ) {
    this.generalFilters$ = this.store.select(state => state.filters.generalFilters);

    combineLatest([
      this.generalFilters$.pipe(distinctUntilChanged()),
      this.store.select(selectPageSize).pipe(distinctUntilChanged()),
      this.store.select(selectPageIndex).pipe(distinctUntilChanged())
    ])
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(([generalFilters, pageSize, pageIndex]) => {
        this.generalFilters = generalFilters;
        this.pageSizeBilling = pageSize;
        this.pageIndexBilling = pageIndex + 1;
        this.pageSizeHistory = pageSize;
        this.pageIndexHistory = pageIndex + 1;

        if (this.paginator) {
          this.paginator.pageSize = pageSize;
          this.paginator.pageIndex = pageIndex;
        }

        this.getBilling();
        this.getHistory();
      });

    this.drawerOpenSub = this.store.select(selectDrawer).subscribe((response: DrawerGeneral) => {
      if (this.drawerOpen) {
        this.drawerOpen = response.drawerOpen;
        this.drawerAction = response.drawerAction;
        this.drawerInfo = response.drawerInfo;
      }
    });
  }

  getBilling() {
    const filters: any = {
      pageSize: this.pageSizeBilling,
      page: this.pageIndexBilling,
      year: this.generalFilters.year,
      clientId: this.getUserClient.clientes[0]
    };

    this.moduleServices.getBillingOverview(filters).subscribe({
      next: (response: entity.DataBillingOverviewTableMapper) => {
        this.dataSourceBilling.data = response?.data;
        this.totalItemsBilling = response?.totalItems;
        this.dataSourceBilling.sort = this.sort;
        this.pageIndexBilling = filters.page;
      },
      error: error => {
        // this.notificationService.notificacion(`Talk to the administrator.`, 'alert');
        // console.log(error);
      }
    });
  }

  getHistory() {
    const filters: any = {
      pageSize: this.pageSizeHistory,
      page: this.pageIndexHistory,
      year: this.generalFilters.year,
      clientId: this.getUserClient.clientes[0]
    };

    this.moduleServices.getBillingHistory(filters).subscribe({
      next: (response: entity.DataHistoryOverviewTableMapper) => {
        this.dataSourceHistory.data = response?.data;
        this.totalItemsHistory = response?.totalItems;
        this.dataSourceHistory.sort = this.sort;
        this.pageIndexHistory = filters.page;
      },
      error: error => {
        // this.notificationService.notificacion(`Talk to the administrator.`, 'alert');
        // console.log(error);
      }
    });
  }

  changePageSize(event: any, type?: string) {
    const newSize = event.value;

    if (type == 'overview') {
      this.pageSizeBilling = newSize;

      if (this.paginator) {
        this.paginator.pageSize = newSize;
        this.paginator._changePageSize(newSize);
      }

      this.getBilling();
    }

    else {
      this.pageSizeHistory = newSize;

      if (this.paginator) {
        this.paginator.pageSize = newSize;
        this.paginator._changePageSize(newSize);
      }

      this.getHistory();
    }
  }

  viewDetails(data: any) {
    this.dataBilling = { ...data };
    this.drawerOpen = !this.drawerOpen;
    this.updDraweStateEdit(true);
  }

  updDraweStateEdit(estado: boolean): void {
    this.store.dispatch(updateDrawer({ drawerOpen: estado, drawerAction: "Create", drawerInfo: this.dataBilling, needReload: false }));
  }

  get getUserClient() {
    const encryptedData = localStorage.getItem('userInfo');
    if (encryptedData) return this.encryptionService.decryptData(encryptedData);
  }

  getServerData(event: PageEvent): void {
    if (event.pageSize !== this.pageSizeBilling || event.pageIndex !== this.pageIndexBilling - 1) {
      this.store.dispatch(updatePagination({ pageIndex: event.pageIndex, pageSize: event.pageSize }));
    }
  }
}

