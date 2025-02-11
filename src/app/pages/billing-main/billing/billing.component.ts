import { AfterViewChecked, AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import * as entity from '../billing-model';
import { combineLatest, debounceTime, distinctUntilChanged, Observable, Subject, Subscription, takeUntil } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Store } from '@ngrx/store';
import { OpenModalsService } from '@app/shared/services/openModals.service';
import { Router } from '@angular/router';
import { BillingService } from '../billing.service';
import { selectPageIndex, selectPageSize } from '@app/core/store/selectors/paginator.selector';
import { FormControl } from '@angular/forms';
import { updatePagination } from '@app/core/store/actions/paginator.actions';
import { FilterState, GeneralFilters, UserInfo } from '@app/shared/models/general-models';
import { PeriodicElement } from '@app/pages/plants-main/plants-model';
import { SelectionModel } from '@angular/cdk/collections';
import { EncryptionService } from '@app/shared/services/encryption.service';
import { NotificationDataService } from '@app/shared/services/notificationData.service';
import { NOTIFICATION_CONSTANTS } from '@app/core/constants/notification-constants';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-billing',
  templateUrl: './billing.component.html',
  styleUrl: './billing.component.scss'
})
export class BillingComponent implements OnDestroy, OnInit, AfterViewChecked, AfterViewInit {
  ADD = NOTIFICATION_CONSTANTS.ADD_CONFIRM_TYPE;
  CANCEL = NOTIFICATION_CONSTANTS.CANCEL_TYPE;

  private onDestroy$ = new Subject<void>();

  generalFilters$!: Observable<FilterState['generalFilters']>;

  dataSource = new MatTableDataSource<any>([]);
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;
  pageSizeOptions: number[] = [5, 10, 20, 50];
  pageSize: number = 10;
  pageIndex: number = 1;
  totalItems: number = 0;
  displayedColumns: string[] = [
    'clientId',
    'subClientId',
    'clientName',
    'subClient',
    'rfc',
    'month',
    'year',
    'billingPeriodStart',
    'billingPeriodEnd',
    'receiptGenerationDate',
    'cfcContact',
    'rate',
    'production',
    'previousPaymentAmount',
    'totalAmount'
  ];
  pageSizeSub!: Subscription;
  pageIndexSub!: Subscription;
  selection = new SelectionModel<PeriodicElement>(true, []);

  allRowsInit: boolean = false;

  formatTimer: any;

  dummy: any[] = [
    {
      clientId: '001',
      subClientId: '026',
      clientName: 'Customer name',
      subClient: 'Plant name',
      rfc: 'ER02856969UX3',
      month: 'Jan',
      year: '2025',
      billingPeriodStart: '01/01/2025',
      billingPeriodEnd: '31/01/2025',
      receiptGenerationDate: '31/01/2025',
      cfcContact: 'CFE-987654',
      rate: '$000,000.00 MXN',
      production: '5,000 kWh',
      previousPaymentAmount: '$000,000.00 MXN',
      totalAmount: '$000,000.00 MXN',
    },
    {
      clientId: '001',
      subClientId: '026',
      clientName: 'Customer name',
      subClient: 'Plant name',
      rfc: 'ER02856969UX3',
      month: 'Jan',
      year: '2025',
      billingPeriodStart: '01/01/2025',
      billingPeriodEnd: '31/01/2025',
      receiptGenerationDate: '31/01/2025',
      cfcContact: 'CFE-987654',
      rate: '$000,000.00 MXN',
      production: '5,000 kWh',
      previousPaymentAmount: '$000,000.00 MXN',
      totalAmount: '$000,000.00 MXN',
    },
    {
      clientId: '001',
      subClientId: '026',
      clientName: 'Customer name',
      subClient: 'Plant name',
      rfc: 'ER02856969UX3',
      month: 'Jan',
      year: '2025',
      billingPeriodStart: '01/01/2025',
      billingPeriodEnd: '31/01/2025',
      receiptGenerationDate: '31/01/2025',
      cfcContact: 'CFE-987654',
      rate: '$000,000.00 MXN',
      production: '5,000 kWh',
      previousPaymentAmount: '$000,000.00 MXN',
      totalAmount: '$000,000.00 MXN',
    },
    {
      clientId: '001',
      subClientId: '026',
      clientName: 'Customer name',
      subClient: 'Plant name',
      rfc: 'ER02856969UX3',
      month: 'Jan',
      year: '2025',
      billingPeriodStart: '01/01/2025',
      billingPeriodEnd: '31/01/2025',
      receiptGenerationDate: '31/01/2025',
      cfcContact: 'CFE-987654',
      rate: '$000,000.00 MXN',
      production: '5,000 kWh',
      previousPaymentAmount: '$000,000.00 MXN',
      totalAmount: '$000,000.00 MXN',
    },
    {
      clientId: '001',
      subClientId: '026',
      clientName: 'Customer name',
      subClient: 'Plant name',
      rfc: 'ER02856969UX3',
      month: 'Jan',
      year: '2025',
      billingPeriodStart: '01/01/2025',
      billingPeriodEnd: '31/01/2025',
      receiptGenerationDate: '31/01/2025',
      cfcContact: 'CFE-987654',
      rate: '$000,000.00 MXN',
      production: '5,000 kWh',
      previousPaymentAmount: '$000,000.00 MXN',
      totalAmount: '$000,000.00 MXN',
    },
    {
      clientId: '001',
      subClientId: '026',
      clientName: 'Customer name',
      subClient: 'Plant name',
      rfc: 'ER02856969UX3',
      month: 'Jan',
      year: '2025',
      billingPeriodStart: '01/01/2025',
      billingPeriodEnd: '31/01/2025',
      receiptGenerationDate: '31/01/2025',
      cfcContact: 'CFE-987654',
      rate: '$000,000.00 MXN',
      production: '5,000 kWh',
      previousPaymentAmount: '$000,000.00 MXN',
      totalAmount: '$000,000.00 MXN',
    },
    {
      clientId: '001',
      subClientId: '026',
      clientName: 'Customer name',
      subClient: 'Plant name',
      rfc: 'ER02856969UX3',
      month: 'Jan',
      year: '2025',
      billingPeriodStart: '01/01/2025',
      billingPeriodEnd: '31/01/2025',
      receiptGenerationDate: '31/01/2025',
      cfcContact: 'CFE-987654',
      rate: '$000,000.00 MXN',
      production: '5,000 kWh',
      previousPaymentAmount: '$000,000.00 MXN',
      totalAmount: '$000,000.00 MXN',
    },
    {
      clientId: '001',
      subClientId: '026',
      clientName: 'Customer name',
      subClient: 'Plant name',
      rfc: 'ER02856969UX3',
      month: 'Jan',
      year: '2025',
      billingPeriodStart: '01/01/2025',
      billingPeriodEnd: '31/01/2025',
      receiptGenerationDate: '31/01/2025',
      cfcContact: 'CFE-987654',
      rate: '$000,000.00 MXN',
      production: '5,000 kWh',
      previousPaymentAmount: '$000,000.00 MXN',
      totalAmount: '$000,000.00 MXN',
    },
    {
      clientId: '001',
      subClientId: '026',
      clientName: 'Customer name',
      subClient: 'Plant name',
      rfc: 'ER02856969UX3',
      month: 'Jan',
      year: '2025',
      billingPeriodStart: '01/01/2025',
      billingPeriodEnd: '31/01/2025',
      receiptGenerationDate: '31/01/2025',
      cfcContact: 'CFE-987654',
      rate: '$000,000.00 MXN',
      production: '5,000 kWh',
      previousPaymentAmount: '$000,000.00 MXN',
      totalAmount: '$000,000.00 MXN',
    },
    {
      clientId: '001',
      subClientId: '026',
      clientName: 'Customer name',
      subClient: 'Plant name',
      rfc: 'ER02856969UX3',
      month: 'Jan',
      year: '2025',
      billingPeriodStart: '01/01/2025',
      billingPeriodEnd: '31/01/2025',
      receiptGenerationDate: '31/01/2025',
      cfcContact: 'CFE-987654',
      rate: '$000,000.00 MXN',
      production: '5,000 kWh',
      previousPaymentAmount: '$000,000.00 MXN',
      totalAmount: '$000,000.00 MXN',
    },
    {
      clientId: '001',
      subClientId: '026',
      clientName: 'Customer name',
      subClient: 'Plant name',
      rfc: 'ER02856969UX3',
      month: 'Jan',
      year: '2025',
      billingPeriodStart: '01/01/2025',
      billingPeriodEnd: '31/01/2025',
      receiptGenerationDate: '31/01/2025',
      cfcContact: 'CFE-987654',
      rate: '$000,000.00 MXN',
      production: '5,000 kWh',
      previousPaymentAmount: '$000,000.00 MXN',
      totalAmount: '$000,000.00 MXN',
    },
    {
      clientId: '001',
      subClientId: '026',
      clientName: 'Customer name',
      subClient: 'Plant name',
      rfc: 'ER02856969UX3',
      month: 'Jan',
      year: '2025',
      billingPeriodStart: '01/01/2025',
      billingPeriodEnd: '31/01/2025',
      receiptGenerationDate: '31/01/2025',
      cfcContact: 'CFE-987654',
      rate: '$000,000.00 MXN',
      production: '5,000 kWh',
      previousPaymentAmount: '$000,000.00 MXN',
      totalAmount: '$000,000.00 MXN',
    },
  ];

  searchBar = new FormControl('');

  generalFilters!: GeneralFilters
  userInfo!: UserInfo;

  oneConfirmInvoice!: entity.DataBillingTable;

  ngAfterViewChecked() {
    if (this.paginator) this.paginator.pageIndex = this.pageIndex - 1;
    else console.error('Paginator no está definido');
  }

  constructor(
    private store: Store<{ filters: FilterState }>,
    private notificationService: OpenModalsService,
    private router: Router,
    public dialog: MatDialog,
    private notificationDataService: NotificationDataService,
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
        this.pageSize = pageSize;
        this.pageIndex = pageIndex + 1;

        if (this.paginator) {
          this.paginator.pageSize = pageSize;
          this.paginator.pageIndex = pageIndex;
        }

        this.getBilling();
      });
  }

  ngOnInit(): void {
    this.getUserClient()
  }

  ngAfterViewInit(): void {
    this.searchBar.valueChanges.pipe(debounceTime(500), takeUntil(this.onDestroy$), distinctUntilChanged()).subscribe(content => {
      this.getBilling(content!);
    });
  }

  getUserClient() {
    const encryptedData = localStorage.getItem('userInfo');
    if (encryptedData) this.userInfo = this.encryptionService.decryptData(encryptedData);
  }

  getBilling(searchTerm: string = '') {
    // const filters = {
    //   plantName: searchTerm,
    //   pageSize: this.pageSize,
    //   page: this.pageIndex,
    //   ...this.generalFilters
    // };

    // this.moduleServices.getBillingData(filters).subscribe({
    //   next: (response: entity.DataBillingTableMapper) => {
    //     this.dataSource.data = response?.data;
    //     this.totalItems = response?.totalItems;
    //     this.dataSource.sort = this.sort;
    //     this.pageIndex = filters.page;
    //   },
    //   error: error => {
    //     this.notificationService.notificacion(`Talk to the administrator.`, 'alert');
    //     console.log(error);
    //   }
    // });
    this.dataSource.data = this.dummy

  }

  changePageSize(event: any) {
    const newSize = event.value;
    this.pageSize = newSize;

    if (this.paginator) {
      this.paginator.pageSize = newSize;
      this.paginator._changePageSize(newSize);
    }

    this.getBilling();
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
