import { AfterViewChecked, AfterViewInit, Component, OnDestroy, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { AssetsService } from '../assets.service';
import { Subject, Subscription, debounceTime, takeUntil } from 'rxjs';
import * as entity from '../assets-model';
import { OpenModalsService } from '@app/shared/services/openModals.service';
import { Store } from '@ngrx/store';
import { selectPageIndex, selectPageSize } from '@app/core/store/selectors/paginator.selector';
import { updatePagination } from '@app/core/store/actions/paginator.actions';
import { FormControl } from '@angular/forms';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-management',
  templateUrl: './management.component.html',
  styleUrl: './management.component.scss'
})
export class ManagementComponent implements OnDestroy, AfterViewChecked, AfterViewInit {
  private onDestroy = new Subject<void>();
  dataSource = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator,{ static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;

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

  totalPlants!: entity.DataSummaryProjectsMapper;

  searchValue: string = '';

  pageSizeOptions: number[] = [5, 10, 20, 50];
  pageSize: number = 5;
  pageIndex: number = 1 ;
  totalItems: number = 0;

  showLoader: boolean = true;
  loadingtotalPlants: boolean = true;

  pageSizeSub: Subscription;
  pageIndexSub: Subscription;

  searchBar = new FormControl('');

  constructor(private store: Store, private moduleServices: AssetsService, private notificationService: OpenModalsService, private router: Router) {
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
    this.getSummaryProjects();
  };

  ngAfterViewInit(): void {
    this.searchBar.valueChanges.pipe(debounceTime(500), takeUntil(this.onDestroy)).subscribe(content => {
      this.getDataResponse(1, content!);
    })
  }

  getServerData(event: PageEvent): void {
    this.store.dispatch(updatePagination({ pageIndex: event.pageIndex, pageSize: event.pageSize }));
    this.getDataResponse(event.pageIndex + 1, this.searchValue);
  }

  getDataResponse(page: number, name: string) {
    this.moduleServices.getDataAssetsmanagement(name, this.pageSize, page).subscribe({
      next: (response : entity.DataManagementTableResponse) => {
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
      next: (response : entity.DataSummaryProjectsMapper) => {
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

  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.unsubscribe();
  }
}
