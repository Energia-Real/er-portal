import { AfterViewChecked, AfterViewInit, Component, OnDestroy, ViewChild } from '@angular/core';
import * as entity from '../billing-model';
import { debounceTime, Subject, Subscription, takeUntil } from 'rxjs';
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

@Component({
  selector: 'app-billing',
  templateUrl: './billing.component.html',
  styleUrl: './billing.component.scss'
})
export class BillingComponent implements OnDestroy, AfterViewChecked, AfterViewInit {
  private onDestroy$ = new Subject<void>();

  dataSource = new MatTableDataSource<any>([]);
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;
  pageSizeOptions: number[] = [5, 10, 20, 50];
  pageSize: number = 5;
  pageIndex: number = 1;
  totalItems: number = 0;
  displayedColumns: string[] = [
    'rpu',
    'clientName',
    'plantName',
    'generatedEnergyKwh',
    'amount',
    'amountWithIva',
  ];

  years: { value: number }[] = [
    { value: 2024 },
  ];

  months: { value: number, viewValue: string }[] = [
    { value: 1, viewValue: 'January' },
    { value: 2, viewValue: 'February' },
    { value: 3, viewValue: 'March' },
    { value: 4, viewValue: 'April' },
    { value: 5, viewValue: 'May' },
    { value: 6, viewValue: 'June' },
    { value: 7, viewValue: 'July' },
    { value: 8, viewValue: 'August' },
    { value: 9, viewValue: 'September' },
    { value: 10, viewValue: 'October' },
    { value: 11, viewValue: 'November' },
    { value: 12, viewValue: 'December' }
  ];


  pageSizeSub: Subscription;
  pageIndexSub: Subscription;

  searchBar = new FormControl('');
  selectedMonth = new FormControl(new Date().getMonth() + 1);

  selectedYear: any = 2024

  ngAfterViewChecked() {
    if (this.paginator) this.paginator.pageIndex = this.pageIndex - 1;
    else console.error('Paginator no está definido');
  }

  constructor(
    private store: Store,
    private notificationService: OpenModalsService,
    private router: Router,
    private moduleServices: BillingService) {
    this.pageSizeSub = this.store.select(selectPageSize).subscribe(size => {
      this.pageSize = size;
      if (this.paginator) this.paginator.pageSize = size;
    });

    this.pageIndexSub = this.store.select(selectPageIndex).subscribe(index => {
      this.pageIndex = index + 1;
      if (this.paginator) this.paginator.pageIndex = index;
      this.getDataResponse(index + 1, '', this.selectedMonth?.value);
    });
  }

  ngAfterViewInit(): void {
    this.searchBar.valueChanges.pipe(debounceTime(500), takeUntil(this.onDestroy$)).subscribe(content => {
      this.getDataResponse(1, content!, this.selectedMonth.value ? this.selectedMonth.value : '');
    })

    this.selectedMonth.valueChanges.pipe(debounceTime(500), takeUntil(this.onDestroy$)).subscribe(content => {
      this.getDataResponse(1, this.searchBar.value ? this.searchBar.value : '', content)
    })
  }

  getDataResponse(page: number, name: string, month: any) {
    const filters: any = {
      name,
      month,
      year: this.selectedYear
    };

    this.moduleServices.getBillingData(filters, this.pageSize, page).subscribe({
      next: (response: entity.DataBillingTableMapper) => {
        console.log(response.data);
        
        this.dataSource.data = response?.data;
        this.totalItems = response?.totalItems;
        this.dataSource.sort = this.sort;
        this.pageIndex = page
      },
      error: error => {
        console.log(error);
      }
    });
  }

  getMonthName(month: number) {
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
  
    return months[month - 1];
  }

  navigate(link: string) {
    this.router.navigateByUrl(link);
  }

  getServerData(event: PageEvent): void {
    this.store.dispatch(updatePagination({ pageIndex: event.pageIndex, pageSize: event.pageSize }));
    this.getDataResponse(event.pageIndex + 1, '', this.selectedMonth?.value);
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.unsubscribe();
  }
}
