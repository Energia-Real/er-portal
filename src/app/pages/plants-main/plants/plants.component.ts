import { AfterViewInit, Component, OnDestroy, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { combineLatest, debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';
import * as entity from '../plants-model';
import { FormControl } from '@angular/forms';
import { Store } from '@ngrx/store';
import { PlantsService } from '../plants.service';
import { selectPageIndex, selectPageSize } from '@app/core/store/selectors/paginator.selector';
import { updatePagination } from '@app/core/store/actions/paginator.actions';
import { OpenModalsService } from '@app/shared/services/openModals.service';
import { Router } from '@angular/router';
import { TranslationService } from '@app/shared/services/i18n/translation.service';

@Component({
    selector: 'app-plants',
    templateUrl: './plants.component.html',
    styleUrl: './plants.component.scss',
    standalone: false
})
export class PlantsComponent implements OnDestroy, AfterViewInit {
  private onDestroy$ = new Subject<void>();

  dataSource = new MatTableDataSource<any>([]);
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;
  pageSizeOptions: number[] = [5, 10, 20, 50];
  pageSize: number = 5;
  pageIndex: number = 1;
  totalItems: number = 0;

  displayedColumns: string[] = [
    'plantName',
    'rpu',
    'clientName',
    'commissionDate',
    'inverterQty',
    'systemSize',
    'nominalPower',
    'assetStatus',
    'googleMapAdress',
    'actions'
  ];

  showLoader: boolean = true;
  loadingtotalPlants: boolean = true;

  searchBar = new FormControl('');

  totalPlants!: entity.DataSummaryProjectsMapper;

  constructor(
    private store: Store,
    private moduleServices: PlantsService,
    private notificationService: OpenModalsService,
    private router: Router,
    private translationService: TranslationService
  ) {
    combineLatest([
      this.store.select(selectPageSize).pipe(distinctUntilChanged()),
      this.store.select(selectPageIndex).pipe(distinctUntilChanged())
    ])
    .pipe(takeUntil(this.onDestroy$))
    .subscribe(([pageSize, pageIndex]) => {
      if (this.pageSize !== pageSize || this.pageIndex !== pageIndex + 1) {
        this.pageSize = pageSize;
        this.pageIndex = pageIndex + 1;
    
        if (this.paginator) {
          this.paginator.pageSize = pageSize;
          this.paginator.pageIndex = pageIndex;
        }
    
        this.getPlants();
      }
    });
  }

  ngOnInit(): void {
    this.getSummaryProjects();
  };

  ngAfterViewInit(): void {
    if (this.paginator) this.paginator.pageIndex = this.pageIndex - 1;
    else console.error('Paginator no está definido');

    this.searchBar.valueChanges.pipe(debounceTime(500), takeUntil(this.onDestroy$))
      .subscribe(content => this.getPlants(content!))
  }

  getPlants(name = '') {
    const filters: entity.FiltersPlants = {
      pageSize: this.pageSize,
      page: this.pageIndex,
      name
    };

    this.moduleServices.getPlants(filters).subscribe({
      next: (response: entity.DataManagementTableResponse) => {
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

  getSummaryProjects() {
    this.moduleServices.getSummaryProjects().subscribe({
      next: (response: entity.DataSummaryProjectsMapper) => {
        this.totalPlants = response;
        this.loadingtotalPlants = false
      },
      error: error => {
        this.loadingtotalPlants = false;
        this.notificationService.notificacion(`Talk to the administrator.`, 'alert')
        console.log(error);
      }
    })
  };

  navigate(link: string) {
    this.router.navigateByUrl(link);
  }

  changePageSize(event: any) {
    const newSize = event.value;
    this.pageSize = newSize;

    if (this.paginator) {
      this.paginator.pageSize = newSize;
      this.paginator._changePageSize(newSize);
    }

    this.getPlants();
  }

  getServerData(event: PageEvent): void {
    if (event.pageSize !== this.pageSize || event.pageIndex !== this.pageIndex - 1) {
      this.store.dispatch(updatePagination({ pageIndex: event.pageIndex, pageSize: event.pageSize }));
    }
  }
  
  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
