import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
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
export class BillingOverviewComponent implements OnInit, OnDestroy {
  private onDestroy$ = new Subject<void>();

  generalFilters$!: Observable<FilterState['generalFilters']>;

  dataSourceBilling = new MatTableDataSource<any>([]);
  dataSourceHistory = new MatTableDataSource<any>([]);

  @ViewChild('paginatorBilling', { static: false }) paginatorBilling!: MatPaginator;
  @ViewChild('paginatorHistory', { static: false }) paginatorHistory!: MatPaginator;
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
  drawerOpenSub: Subscription = new Subscription();

  generalFilters!: GeneralFilters
  userInfo!: UserInfo;

  dataBilling!: entity.DataBillingOverviewTable;

  constructor(
    private store: Store<{ filters: FilterState }>,
    public dialog: MatDialog,
    private encryptionService: EncryptionService,
    private moduleServices: BillingService
  ) {
    this.generalFilters$ = this.store.select(state => state.filters.generalFilters);

    combineLatest([
      this.generalFilters$.pipe(distinctUntilChanged()),
      this.store.select(selectPageSize).pipe(distinctUntilChanged()),
      this.store.select(selectPageIndex).pipe(distinctUntilChanged()),
    ])
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(([generalFilters, pageSize, pageIndex]) => {
        this.generalFilters = generalFilters;
        this.pageSizeBilling = pageSize;
        this.pageIndexBilling = pageIndex + 1;
        this.pageSizeHistory = pageSize;
        this.pageIndexHistory = pageIndex + 1;

        if (this.paginatorBilling) {
          this.paginatorBilling.pageSize = this.pageSizeBilling;
          this.paginatorBilling.pageIndex = this.pageIndexBilling - 1;
        }

        if (this.paginatorHistory) {
          this.paginatorHistory.pageSize = this.pageSizeHistory;
          this.paginatorHistory.pageIndex = this.pageIndexHistory - 1;
        }

        this.getBilling();
        this.getHistory();
      });
  }

  ngOnInit(): void {
    this.drawerOpenSubsctiption();
  }

  // Usando el takeUntil(this.onDestroy$), no es necesario almacenar la suscripción en una variable
  // como this.drawerOpenSub, ya que takeUntil 
  // se encarga de limpiar la suscripción automáticamente cuando el 
  // componente es destruido (lo que ocurre cuando se emite el onDestroy$).
  drawerOpenSubsctiption() {
    this.store.select(selectDrawer).pipe(takeUntil(this.onDestroy$)).subscribe((response: DrawerGeneral) => {
      this.drawerOpen = response.drawerOpen;
      this.drawerAction = response.drawerAction;
      this.drawerInfo = response.drawerInfo;
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

    if (type === 'overview') {
      this.pageSizeBilling = newSize;

      if (this.paginatorBilling) {
        this.paginatorBilling.pageSize = newSize;
        this.paginatorBilling._changePageSize(newSize);
      }

      this.getBilling();
    }
    else {
      this.pageSizeHistory = newSize;

      if (this.paginatorHistory) {
        this.paginatorHistory.pageSize = newSize;
        this.paginatorHistory._changePageSize(newSize);
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
    return encryptedData ? this.encryptionService.decryptData(encryptedData) : null;
  }

  getServerData(event: PageEvent, type: 'billing' | 'history'): void {
    if (type === 'billing') {
      if (event.pageSize != this.pageSizeBilling || event.pageIndex != this.pageIndexBilling - 1) {
        this.store.dispatch(updatePagination({ pageIndex: event.pageIndex, pageSize: event.pageSize }));
      }
    } else {
      if (event.pageSize != this.pageSizeHistory || event.pageIndex != this.pageIndexHistory - 1) {
        this.store.dispatch(updatePagination({ pageIndex: event.pageIndex, pageSize: event.pageSize }));
      }
    }
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.unsubscribe();
  }
}

