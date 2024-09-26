import { AfterViewChecked, AfterViewInit, Component, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { FormatsService } from '@app/shared/services/formats.service';
import { OpenModalsService } from '@app/shared/services/openModals.service';
import { Store } from '@ngrx/store';
import { debounceTime, Subject, Subscription, takeUntil } from 'rxjs';
import { selectPageIndex, selectPageSize } from '@app/core/store/selectors/paginator.selector';
import { updatePagination } from '@app/core/store/actions/paginator.actions';
import { SelectionModel } from '@angular/cdk/collections';
import * as entity from '../payments-model';
import { ModalPayComponent } from '../modal-pay/modal-pay.component';

@Component({
  selector: 'app-select-pay',
  templateUrl: './select-pay.component.html',
  styleUrl: './select-pay.component.scss'
})
export class SelectPayComponent implements OnDestroy, AfterViewChecked, AfterViewInit {
  private onDestroy$ = new Subject<void>();
  dataSource = new MatTableDataSource<any>([]);
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;
  selection = new SelectionModel<entity.PeriodicElement>(true, []);
  pageSizeOptions: number[] = [5, 10, 20, 50];
  pageSize: number = 5;
  pageIndex: number = 1 ;
  totalItems: number = 0;
  pageSizeSub: Subscription;
  pageIndexSub: Subscription;

  ngAfterViewChecked() {
    if (this.paginator) {
      this.paginator.pageIndex = this.pageIndex - 1;
    } else {
      console.error('Paginator no está definido');
    }
  }

    displayedColumns: string[] = [
    'siteName',
    'rpu',
    'billingperiod',
    'tariffDivision',
    'productionMWh',
    'rate',
    'consumption',
    'solarSavings',
    'erBill',
    'cfeBill',
    'dueDate',
    'pay'
  ];

  datadummy = [
    {
      siteName : 'Chedraui Capulhuac',
      rpu : 'ER_1234_r389',
      billingperiod : '11 may 23 / 01 jun 23',
      tariffDivision : 'Zone 1',
      productionMWh : '19,124',
      rate : '0.090',
      consumption : '10',
      solarSavings : '$1,308',
      erBill : 'ER bill',
      cfeBill : 'Download',
      dueDate : '16 jun 2023',
    },
    {
      siteName : 'Chedraui Capulhuac',
      rpu : 'ER_1234_r389',
      billingperiod : '11 may 23 / 01 jun 23',
      tariffDivision : 'Zone 1',
      productionMWh : '19,124',
      rate : '0.090',
      consumption : '10',
      solarSavings : '$1,308',
      erBill : 'ER bill',
      cfeBill : 'Download',
      dueDate : '16 jun 2023',
    },
    {
      siteName : 'Chedraui Capulhuac',
      rpu : 'ER_1234_r389',
      billingperiod : '11 may 23 / 01 jun 23',
      tariffDivision : 'Zone 1',
      productionMWh : '19,124',
      rate : '0.090',
      consumption : '10',
      solarSavings : '$1,308',
      erBill : 'ER bill',
      cfeBill : 'Download',
      dueDate : '16 jun 2023',
    },
  ]


  allRowsInit:boolean = true;




  formFilters = this.formBuilder.group({
    rangeDateStart: [{ value: '', disabled: false }],
    rangeDateEnd: [{ value: '', disabled: false }],
  });

  searchBar = new FormControl('');
  searchValue: string = '';

 
  constructor(
    private router: Router,
    private store: Store,
    private formBuilder: FormBuilder,
    private notificationService: OpenModalsService,
    private formatsService: FormatsService
  ) { 

    this.pageSizeSub = this.store.select(selectPageSize).subscribe(size => {
      this.pageSize = size;
      if (this.paginator) {
        this.paginator.pageSize = size; 
      }
    });
    this.pageIndexSub = this.store.select(selectPageIndex).subscribe(index => {
      this.pageIndex = index + 1;
      if (this.paginator) {
        this.paginator.pageIndex = index; 
      }
      this.getDataResponse(index+1, this.searchValue); 
    });
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.dataSource.data = this.datadummy
    }, 500);
  }

  ngAfterViewInit(): void {
    this.searchBar.valueChanges.pipe(debounceTime(500), takeUntil(this.onDestroy$)).subscribe(content => {
      this.getDataResponse(1, content!);
    })
  }

  getDataResponse(page: number, name: string) {
    // this.moduleServices.getDataAssetsmanagement(name, this.pageSize, page).subscribe({
    //   next: (response : entity.DataManagementTableResponse) => {
    //     this.dataSource.data = response?.data;
    //     this.totalItems = response?.totalItems;
    //     this.dataSource.sort = this.sort;
    //     this.pageIndex = page
    //   },
    //   error: error => {
    //     this.notificationService.notificacion(`Talk to the administrator.`, 'alert');
    //     console.log(error);
    //   }
    // });
  }

  getServerData(event: PageEvent): void {
    this.store.dispatch(updatePagination({ pageIndex: event.pageIndex, pageSize: event.pageSize }));
    this.getDataResponse(event.pageIndex + 1, this.searchValue);
  }

  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }

  toggleRow(row: any) {
    this.selection.toggle(row);
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }


  checkboxLabel(row?: entity.PeriodicElement): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }

    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }

  payData() {
    this.notificationService.openModalMedium(ModalPayComponent);
}

  goDetails(id: string) {
    this.router.navigateByUrl(`er/plants/details/${id}`)
  }

  navigate(link: string) {
    this.router.navigateByUrl(link);
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.unsubscribe();
  }
}
