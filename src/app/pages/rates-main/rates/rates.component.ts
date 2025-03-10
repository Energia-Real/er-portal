import { AfterViewChecked, AfterViewInit, Component, OnDestroy, ViewChild } from '@angular/core';
import * as entity from '../rates-model';
import { combineLatest, debounceTime, distinctUntilChanged, Observable, Subject, Subscription, takeUntil } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Store } from '@ngrx/store';
import { OpenModalsService } from '@app/shared/services/openModals.service';
import { Router } from '@angular/router';
import { RatesService } from '../rates.service';
import { selectPageIndex, selectPageSize } from '@app/core/store/selectors/paginator.selector';
import { FormControl } from '@angular/forms';
import { updatePagination } from '@app/core/store/actions/paginator.actions';
import { FilterState, GeneralFilters, notificationData } from '@app/shared/models/general-models';
import { HttpErrorResponse } from '@angular/common/http';
import { NotificationComponent } from '@app/shared/components/notification/notification.component';
import { NotificationDataService } from '@app/shared/services/notificationData.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-rates',
  templateUrl: './rates.component.html',
  styleUrl: './rates.component.scss'
})
export class RatesComponent implements OnDestroy, AfterViewChecked, AfterViewInit {
  private onDestroy$ = new Subject<void>();

  generalFilters$!: Observable<GeneralFilters>;

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
    'month',
    'year',
    'kwh',
  ];
  pageSizeSub!: Subscription;
  pageIndexSub!: Subscription;

  searchBar = new FormControl('');

  selectedFile: File | null = null;

  generalFilters!: GeneralFilters

  ngAfterViewChecked() {
    if (this.paginator) this.paginator.pageIndex = this.pageIndex - 1;
    else console.error('Paginator no está definido');
  }

  constructor(
    private router: Router,
    public dialog: MatDialog,
    private store: Store<{ filters: GeneralFilters }>,
    private notificationService: OpenModalsService,
    private notificationDataService: NotificationDataService,
    private moduleServices: RatesService
  ) {
    this.generalFilters$ = this.store.select(state => state.filters);

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

        this.getRates();
      });
  }

  ngAfterViewInit(): void {
    this.searchBar.valueChanges.pipe(debounceTime(500), takeUntil(this.onDestroy$), distinctUntilChanged()).subscribe(content => {
      this.getRates(content!);
    });
  }

  getRates(searchTerm: string = '') {
    const filters = {
      plantName: searchTerm,
      pageSize: this.pageSize,
      page: this.pageIndex,
      ...this.generalFilters
    };

    this.moduleServices.getPricingData(filters).subscribe({
      next: (response: entity.DataPricingTableMapper) => {
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

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    this.uploadExcel();
  }

  downloadExcel() {
    this.moduleServices.downloadExcel().subscribe({
      next: (response: Blob) => {
        const blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const link = document.createElement('a');
        const url = window.URL.createObjectURL(blob);
        link.href = url;
        link.download = 'ExcelTemplate.xlsx';
        link.click();
        window.URL.revokeObjectURL(url);
      },
      error: error => {
        this.notificationService.notificacion('Talk to the administrator.', 'alert');
        console.log(error);
      }
    });
  }

  uploadExcel() {
    if (this.selectedFile) {
      this.moduleServices.uploadExcel(this.selectedFile).subscribe({
        next: (response) => {
          this.completionMessage(true);
        },
        error: (error: HttpErrorResponse) => {
          const errorMessages = error?.error?.errors?.errors.map((e: any) => e.descripcion)
          this.modalErrors(errorMessages);
        }
      });
    }
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
    if (event.pageSize !== this.pageSize || event.pageIndex !== this.pageIndex - 1) {
      this.store.dispatch(updatePagination({ pageIndex: event.pageIndex, pageSize: event.pageSize }));
    }
  }

  changePageSize(event: any) {
    const newSize = event.value;
    this.pageSize = newSize;

    if (this.paginator) {
      this.paginator.pageSize = newSize;
      this.paginator._changePageSize(newSize);
    }

    this.getRates();
  }

  completionMessage(load: boolean) {
    this.notificationService.notificacion(`Excel ${load ? 'Loaded' : 'Downloaded'}.`, 'save')
    this.getRates(this.searchBar?.value!);
  }

  modalErrors(errors: any) {
    const dataNotificationModal: notificationData = this.notificationDataService.errors(errors)!;
    this.dialog.open(NotificationComponent, {
      width: '540px',
      data: dataNotificationModal
    })
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.unsubscribe();
  }
}
