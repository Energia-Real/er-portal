import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import * as entity from '../billing-model';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DrawerGeneral, GeneralFilters, notificationData, UserInfo } from '@app/shared/models/general-models';
import { EncryptionService } from '@app/shared/services/encryption.service';
import { Store } from '@ngrx/store';
import { combineLatest, distinctUntilChanged, Observable, Subject, Subscription, takeUntil } from 'rxjs';
import { BillingService } from '../billing.service';
import { selectPageIndex, selectPageSize } from '@app/core/store/selectors/paginator.selector';
import { updateDrawer } from '@app/core/store/actions/drawer.actions';
import { selectDrawer } from '@app/core/store/selectors/drawer.selector';
import { MatSelectChange } from '@angular/material/select';
import { NotificationDataService } from '@app/shared/services/notificationData.service';
import { NotificationComponent } from '@app/shared/components/notification/notification.component';

@Component({
  selector: 'app-previous-billing-v2',
  templateUrl: './previous-billing-v2.component.html',
  styleUrl: './previous-billing-v2.component.scss',
  standalone : false
})
export class PreviousBillingV2Component implements OnInit, OnDestroy {
  private onDestroy$ = new Subject<void>();

  generalFilters$!: Observable<GeneralFilters>;

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

  showAlert: boolean = false;
  drawerOpen: boolean = false;
  drawerAction: "Create" | "Edit" = "Create";
  drawerInfo: any | null | undefined = null;

  generalFilters!: GeneralFilters
  userInfo!: UserInfo;

  dataBilling!: entity.DataBillingOverviewTable;

  constructor(
    private store: Store<{ filters: GeneralFilters }>,
    private dialog: MatDialog,
    private notificationDataService: NotificationDataService,
    private encryptionService: EncryptionService,
    private moduleServices: BillingService
  ) {
    this.generalFilters$ = this.store.select(state => state.filters);

    combineLatest([
      this.generalFilters$.pipe(distinctUntilChanged()),
      this.store.select(selectPageSize).pipe(distinctUntilChanged()),
      this.store.select(selectPageIndex).pipe(distinctUntilChanged()),
    ])
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(([generalFilters, pageSize, pageIndex]) => {
        this.generalFilters = generalFilters;

        if (this.paginatorBilling) {
          this.pageSizeBilling = this.paginatorBilling.pageSize;
          this.pageIndexBilling = this.paginatorBilling.pageIndex + 1;
        }

        if (this.paginatorHistory) {
          this.pageSizeHistory = this.paginatorHistory.pageSize;
          this.pageIndexHistory = this.paginatorHistory.pageIndex + 1;
        }

        this.getServerData({ pageIndex: this.pageIndexBilling - 1, pageSize: this.pageSizeBilling }, 'billing');
        this.getServerData({ pageIndex: this.pageIndexHistory - 1, pageSize: this.pageSizeHistory }, 'history');
      });
  }

  ngOnInit(): void {
    this.getUserClient();
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
      clientId: this.userInfo.clientes[0]
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
      clientId: this.userInfo.clientes[0]
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

  changePageSize(event: MatSelectChange, type: 'billing' | 'history') {
    if (type === 'billing') {
      this.pageSizeBilling = event.value;
      this.paginatorBilling.pageSize = this.pageSizeBilling;
      this.getServerData({ pageIndex: this.pageIndexBilling - 1, pageSize: this.pageSizeBilling }, 'billing');
    } else if (type === 'history') {
      this.pageSizeHistory = event.value;
      this.paginatorHistory.pageSize = this.pageSizeHistory;
      this.getServerData({ pageIndex: this.pageIndexHistory - 1, pageSize: this.pageSizeHistory }, 'history');
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

  getUserClient() {

  }

  getServerData(event: PageEvent | any, type: 'billing' | 'history') {
    const encryptedData = localStorage.getItem('userInfo');

    if (!encryptedData) return;

    this.userInfo = this.encryptionService.decryptData(encryptedData);

    if (!this.userInfo?.clientes?.length || !this.userInfo.clientes[0]?.length) {
      if (!this.showAlert) {
        this.showAlert = true;
        this.alertInformationModal();
      }
      return;
    }

    if (type === 'billing') {
      this.pageIndexBilling = event.pageIndex + 1;
      this.pageSizeBilling = event.pageSize;
      this.getBilling();
    } else if (type === 'history') {
      this.pageIndexHistory = event.pageIndex + 1;
      this.pageSizeHistory = event.pageSize;
      this.getHistory();
    }
  }

  alertInformationModal() {
    const dataNotificationModal: notificationData = this.notificationDataService.showNoClientIdAlert();

    this.dialog.open(NotificationComponent, {
      width: '540px',
      data: dataNotificationModal
    });
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}

