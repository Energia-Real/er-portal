import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import * as entity from '../billing-model';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { FilterState, GeneralFilters, UserInfo } from '@app/shared/models/general-models';
import { EncryptionService } from '@app/shared/services/encryption.service';
import { NotificationDataService } from '@app/shared/services/notificationData.service';
import { OpenModalsService } from '@app/shared/services/openModals.service';
import { Store } from '@ngrx/store';
import { combineLatest, distinctUntilChanged, Observable, Subject, Subscription, takeUntil } from 'rxjs';
import { BillingService } from '../billing.service';
import { selectPageIndex, selectPageSize } from '@app/core/store/selectors/paginator.selector';
import { updatePagination } from '@app/core/store/actions/paginator.actions';

@Component({
  selector: 'app-billing-overview',
  templateUrl: './billing-overview.component.html',
  styleUrl: './billing-overview.component.scss'
})
export class BillingOverviewComponent {
  private onDestroy$ = new Subject<void>();

  generalFilters$!: Observable<FilterState['generalFilters']>;

  dataSource = new MatTableDataSource<any>([]);
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;
  pageSizeOptions: number[] = [5, 10, 20, 50];
  pageSize: number = 10;
  pageIndex: number = 1;
  totalItems: number = 0;
  displayedColumnsOverview: string[] = [
    'razonSocial',
    'year',
    'month',
    'amount',
    'actions'
  ];
  pageSizeSub!: Subscription;
  pageIndexSub!: Subscription;

  dataDummy: any = [
    {
      razonSocial: 'ER 012',
      year: '2024',
      month: 'Dec',
      amount: '$100,000.00 MXN',
    },
  ]

  generalFilters!: GeneralFilters
  userInfo!: UserInfo;

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

  getBilling() {
    const filters: any = {
      pageSize: this.pageSize,
      page: this.pageIndex,
      year: this.generalFilters.year,
      clientId: this.getUserClient.clientes[0]
    };

    this.moduleServices.getBillingOverview(filters).subscribe({
      next: (response: entity.DataBillingOverviewTableMapper) => {
        this.dataSource.data = response?.data;
        this.totalItems = response?.totalItems;
        this.dataSource.sort = this.sort;
        this.pageIndex = filters.page;
      },
      error: error => {
        this.notificationService.notificacion(`Talk to the administrator.`, 'alert');
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

    this.getBilling();
  }

  get getUserClient() {
    const encryptedData = localStorage.getItem('userInfo');
    if (encryptedData) return this.encryptionService.decryptData(encryptedData);
  }

  getServerData(event: PageEvent): void {
    if (event.pageSize !== this.pageSize || event.pageIndex !== this.pageIndex - 1) {
      this.store.dispatch(updatePagination({ pageIndex: event.pageIndex, pageSize: event.pageSize }));
    }
  }
}


