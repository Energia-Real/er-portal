import { AfterViewChecked, AfterViewInit, Component, OnDestroy, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { debounceTime, Subject, Subscription, takeUntil } from 'rxjs';
import * as entity from '../plants-model';
import { FormControl } from '@angular/forms';
import { Store } from '@ngrx/store';
import { PlantsService } from '../plants.service';
import { selectPageIndex, selectPageSize } from '@app/core/store/selectors/paginator.selector';
import { updatePagination } from '@app/core/store/actions/paginator.actions';
import { OpenModalsService } from '@app/shared/services/openModals.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-plants',
  templateUrl: './plants.component.html',
  styleUrl: './plants.component.scss'
})
export class PlantsComponent implements OnDestroy, AfterViewChecked, AfterViewInit {
  private onDestroy$ = new Subject<void>();

  dataSource = new MatTableDataSource<any>([]);
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;
  pageSizeOptions: number[] = [5, 10, 20, 50];
  pageSize: number = 5;
  pageIndex: number = 1;
  totalItems: number = 0;
  pageSizeSub: Subscription;
  pageIndexSub: Subscription;

  ngAfterViewChecked() {
    if (this.paginator) this.paginator.pageIndex = this.pageIndex - 1;
    else console.error('Paginator no está definido');
  }

  displayedColumns: string[] = [
    'plantName',
    'rpu',
    'clientName',
    'clientId',
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
    private router: Router
  ) {
    this.pageSizeSub = this.store.select(selectPageSize).subscribe(size => {
      this.pageSize = size;
      if (this.paginator) this.paginator.pageSize = size;
    });

    this.pageIndexSub = this.store.select(selectPageIndex).subscribe(index => {
      this.pageIndex = index + 1;
      if (this.paginator) this.paginator.pageIndex = index;
      this.getPlants(index + 1, '');
    });
  }

  ngOnInit(): void {
    this.getSummaryProjects();
  };

  ngAfterViewInit(): void {
    this.searchBar.valueChanges.pipe(debounceTime(500), takeUntil(this.onDestroy$)).subscribe(content => {
      this.getPlants(1, content!);
    })
  }

  getPlants(page: number, name: string) {
    this.moduleServices.getPlants(name, this.pageSize, page).subscribe({
      next: (response: entity.DataManagementTableResponse) => {
        this.dataSource.data = response?.data;
        this.totalItems = response?.totalItems;
        this.dataSource.sort = this.sort;
        this.pageIndex = page
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
    this.pageSize = event.value;
    this.paginator.pageSize = this.pageSize;
    this.paginator._changePageSize(this.pageSize);
  }

  
  getServerData(event: PageEvent): void {
    this.store.dispatch(updatePagination({ pageIndex: event.pageIndex, pageSize: event.pageSize }));
    this.getPlants(event.pageIndex + 1, '');
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.unsubscribe();
  }
}
