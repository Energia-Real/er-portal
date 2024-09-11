import { AfterViewChecked, AfterViewInit, Component, OnDestroy, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { updateDrawer } from '@app/core/store/actions/drawer.actions';
import { updatePagination } from '@app/core/store/actions/paginator.actions';
import { selectDrawer } from '@app/core/store/selectors/drawer.selector';
import { selectPageIndex, selectPageSize } from '@app/core/store/selectors/paginator.selector';
import { DrawerGeneral } from '@app/shared/models/general-models';
import { OpenModalsService } from '@app/shared/services/openModals.service';
import { Store } from '@ngrx/store';
import { debounceTime, Subject, Subscription, takeUntil } from 'rxjs';

@Component({
  selector: 'app-energy-production',
  templateUrl: './energy-production.component.html',
  styleUrl: './energy-production.component.scss'
})
export class EnergyProductionComponent implements OnDestroy, AfterViewChecked, AfterViewInit {
  private onDestroy$ = new Subject<void>();

  dataSource = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;
  pageSizeOptions: number[] = [5, 10, 20, 50];
  pageSize: number = 5;
  pageIndex: number = 1 ;
  totalItems: number = 0;

  ngAfterViewChecked() {
    if (this.paginator) this.paginator.pageIndex = this.pageIndex - 1;
     else console.error('Paginator no está definido');
  }

  displayedColumns: string[] = [
    'clientName',
    'mes1',
    'mes2',
    'mes3',
    'mes4',
    'mes5',
    'mes6',
    'mes7',
    'mes8',
    'mes9',
    'mes10',
    'mes11',
    'mes12',
  ];

  dataDummy: any[] = [
    {
      name: 'Linda Vista',
      mes1: '',
      mes2: '',
      mes3: '',
      mes4: '',
      mes5: '',
      mes6: '',
      mes7: '',
      mes8: '',
      mes9: '',
      mes10: '',
      mes11: '',
      mes12: '',
    },
    {
      name: 'Santa Elena',
      mes1: '',
      mes2: '',
      mes3: '',
      mes4: '',
      mes5: '',
      mes6: '',
      mes7: '',
      mes8: '',
      mes9: '',
      mes10: '',
      mes11: '',
      mes12: '',
    },
    {
      name: 'CEDIS',
      mes1: '',
      mes2: '',
      mes3: '',
      mes4: '',
      mes5: '',
      mes6: '',
      mes7: '',
      mes8: '',
      mes9: '',
      mes10: '',
      mes11: '',
      mes12: '',
    },
    {
      name: 'Saltillo',
      mes1: '',
      mes2: '',
      mes3: '',
      mes4: '',
      mes5: '',
      mes6: '',
      mes7: '',
      mes8: '',
      mes9: '',
      mes10: '',
      mes11: '',
      mes12: '',
    },
    {
      name: 'Pueblo Nuevo',
      mes1: '',
      mes2: '',
      mes3: '',
      mes4: '',
      mes5: '',
      mes6: '',
      mes7: '',
      mes8: '',
      mes9: '',
      mes10: '',
      mes11: '',
      mes12: '',
    },
  ]

  years: { value: string, viewValue: string }[] = [
    { value: '2020', viewValue: '2020' },
    { value: '2021', viewValue: '2021' },
    { value: '2022', viewValue: '2022' },
    { value: '2023', viewValue: '2023' },
    { value: '2024', viewValue: '2024' },
  ];

  selectedYears: any[] = [];

  pageSizeSub: Subscription;
  pageIndexSub: Subscription;

  searchBar = new FormControl('');
  
  searchValue: string = '';

  drawerOpenClient: boolean = false;
  drawerAction: "Create" | "Edit" = "Create";
  drawerInfo: any | null | undefined = null;
  drawerOpenSub: Subscription;

  editedClient: any;

  constructor(private store: Store, private notificationService: OpenModalsService, private router: Router) {
    this.pageSizeSub = this.store.select(selectPageSize).subscribe(size => {
      this.pageSize = size;
      if (this.paginator) this.paginator.pageSize = size; 
    });

    this.pageIndexSub = this.store.select(selectPageIndex).subscribe(index => {
      this.pageIndex = index + 1;
      if (this.paginator) this.paginator.pageIndex = index; 
      this.getDataResponse(index + 1, this.searchValue); 
    });

    this.drawerOpenSub = this.store.select(selectDrawer).subscribe((resp: DrawerGeneral) => {
      if (!this.drawerOpenClient && !this.editedClient) {
        this.drawerOpenClient = resp.drawerOpen;
        this.drawerAction = resp.drawerAction;
        this.drawerInfo = resp.drawerInfo;
      }
    });
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.dataSource.data = this.dataDummy
    }, 1000);
  };

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

  searchWithFilters() {
    let filtersBatu: any = {};
    let filters: any = {};
    let filtersSolarCoverage: any = {
      brand: "huawei",
      clientName: "Merco",
      months: []
    }
    
    if (this.selectedYears.length) {
      // this.store.dispatch(setFilters({ filters }));
      // this.store.dispatch(setFiltersBatu({ filtersBatu }));
      // this.store.dispatch(setFiltersSolarCoverage({ filtersSolarCoverage }));
    }
  }

  getServerData(event: PageEvent): void {
    this.store.dispatch(updatePagination({ pageIndex: event.pageIndex, pageSize: event.pageSize }));
    this.getDataResponse(event.pageIndex + 1, this.searchValue);
  }

  navigate(link: string) {
    this.router.navigateByUrl(link);
  }
  
  editClient(data: any) {
    this.editedClient = data
    this.updDraweStateEdit(true);
  }

  updDraweStateEdit(estado: boolean): void {
    this.store.dispatch(updateDrawer({ drawerOpen: estado, drawerAction: "Edit", drawerInfo: this.editedClient, needReload: false }));
  }

  toggleDrawer() {
    this.updDraweState(!this.drawerOpenClient);
  }

  toggleDrawerClient(data?: any) {
    this.editedClient = data
    this.drawerOpenClient = !this.drawerOpenClient
    this.updDraweState(this.drawerOpenClient);
  }

  updDraweState(estado: boolean): void {
    this.store.dispatch(updateDrawer({ drawerOpen: estado, drawerAction: "Create", drawerInfo: null, needReload: false }));
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.unsubscribe();
  }
}
