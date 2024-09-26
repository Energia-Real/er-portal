import { AfterViewChecked, AfterViewInit, Component, OnDestroy, ViewChild } from '@angular/core';
import * as entity from '../pricing-model';
import { debounceTime, Subject, Subscription, takeUntil } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Store } from '@ngrx/store';
import { OpenModalsService } from '@app/shared/services/openModals.service';
import { Router } from '@angular/router';
import { PricingService } from '../pricing.service';
import { selectPageIndex, selectPageSize } from '@app/core/store/selectors/paginator.selector';
import { FormControl } from '@angular/forms';
import { updatePagination } from '@app/core/store/actions/paginator.actions';

@Component({
  selector: 'app-pricing',
  templateUrl: './pricing.component.html',
  styleUrl: './pricing.component.scss'
})
export class PricingComponent implements OnDestroy, AfterViewChecked, AfterViewInit {
  private onDestroy$ = new Subject<void>();

  dataSource = new MatTableDataSource<any>([]);
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;
  pageSizeOptions: number[] = [5, 10, 20, 50];
  pageSize: number = 5;
  pageIndex: number = 1;
  totalItems: number = 0;
  displayedColumns: string[] = [
    'siteName',
    'clientName',
    'pricing',
  ];
  pageSizeSub: Subscription;
  pageIndexSub: Subscription;

  dataDummy: any[] = [
    {
      siteName: 'Buena vista',
      clientName: 'Merco',
      pricing: 10,
    },
    {
      siteName: 'Buena vista 2',
      clientName: 'Merco 2',
      pricing: 102,
    },
    {
      siteName: 'Buena vista 3',
      clientName: 'Merco 3',
      pricing: 103,
    },
    {
      siteName: 'Buena vista 4',
      clientName: 'Merco 4',
      pricing: 104,
    },
    {
      siteName: 'Buena vista 5',
      clientName: 'Merco 5',
      pricing: 105,
    },
  ]

  searchBar = new FormControl('');

  searchValue: string = '';

  ngAfterViewChecked() {
    if (this.paginator) this.paginator.pageIndex = this.pageIndex - 1;
    else console.error('Paginator no está definido');
  }

  constructor(
    private store: Store,
    private notificationService: OpenModalsService,
    private router: Router,
    private moduleServices: PricingService) {
    this.pageSizeSub = this.store.select(selectPageSize).subscribe(size => {
      this.pageSize = size;
      if (this.paginator) this.paginator.pageSize = size;
    });

    this.pageIndexSub = this.store.select(selectPageIndex).subscribe(index => {
      this.pageIndex = index + 1;
      if (this.paginator) this.paginator.pageIndex = index;
      this.getDataResponse(index + 1, this.searchValue);
    });
  }

  ngOnInit(): void {
  };

  ngAfterViewInit(): void {
    this.searchBar.valueChanges.pipe(debounceTime(500), takeUntil(this.onDestroy$)).subscribe(content => {
      this.getDataResponse(1, content!);
    })
  }


  getDataResponse(page: number, name?: string) {
    // this.moduleServices.getPricingData(name!, this.pageSize, page).subscribe({
    //   next: (response: any) => {
    //     this.dataSource.data = response?.data;
    this.dataSource.data = this.dataDummy
    //     this.totalItems = response?.totalItems;
    //     this.dataSource.sort = this.sort;
    //     this.pageIndex = page!
    //   },
    //   error: error => {
    //     this.notificationService.notificacion(`Talk to the administrator.`, 'alert');
    //     console.log(error);
    //   }
    // });
  }

  navigate(link: string) {
    this.router.navigateByUrl(link);
  }


  getServerData(event: PageEvent): void {
    this.store.dispatch(updatePagination({ pageIndex: event.pageIndex, pageSize: event.pageSize }));
    this.getDataResponse(event.pageIndex + 1);
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.unsubscribe();
  }
}
