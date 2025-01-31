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
import { DrawerGeneral, FilterState, GeneralFilters, notificationData } from '@app/shared/models/general-models';
import { OpenModalsService } from '@app/shared/services/openModals.service';
import { Store } from '@ngrx/store';
import { debounceTime, Observable, Subject, Subscription, takeUntil } from 'rxjs';
import { EnergyProductionService } from '../energy-production.service';
import * as entity from '../energy-production-model';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { NotificationComponent } from '@app/shared/components/notification/notification.component';
import { MatDialog } from '@angular/material/dialog';
import { HttpErrorResponse } from '@angular/common/http';
import { NotificationDataService } from '@app/shared/services/notificationData.service';


@Component({
  selector: 'app-energy-production',
  templateUrl: './energy-production.component.html',
  styleUrl: './energy-production.component.scss',
  providers: [
    { provide: MatPaginatorIntl, useValue: getPaginatorIntl() }
  ]
})
export class EnergyProductionComponent implements OnDestroy, AfterViewChecked, AfterViewInit {
  private onDestroy$ = new Subject<void>();

  generalFilters$!: Observable<FilterState['generalFilters']>;

  dataSource = new MatTableDataSource<any>([]);
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;
  pageSizeOptions: number[] = [5, 10, 20, 50];
  pageSize: number = 5;
  pageIndex: number = 1;
  totalItems: number = 0;
  displayedColumns: string[] = [
    'siteName',
    'energyMonth1',
    'energyMonth2',
    'energyMonth3',
    'energyMonth4',
    'energyMonth5',
    'energyMonth6',
    'energyMonth7',
    'energyMonth8',
    'energyMonth9',
    'energyMonth10',
    'energyMonth11',
    'energyMonth12',
  ];

  pageSizeSub: Subscription;
  pageIndexSub: Subscription;
  drawerOpenSub: Subscription;

  ngAfterViewChecked() {
    if (this.paginator) this.paginator.pageIndex = this.pageIndex - 1;
    else console.error('Paginator no está definido');
  }

  years: { value: number }[] = [
    { value: 2024 },
  ];

  energyTypes: { value: number, description: string }[] = [
    { value: 1, description: "Energy production" },
    { value: 2, description: "Energy consumption" },
    { value: 3, description: "Energy estimated" },
  ];

  drawerOpenPlant: boolean = false;
  drawerAction: "Create" | "Edit" = "Create";
  drawerInfo: any | null | undefined = null;

  editedClient: any;
  selectedYear: any = 2024

  searchValue: string = '';

  searchBar = new FormControl('');

  selectedFile: File | null = null;

  selectedEnergyType: number = 1;


  constructor(
    private store: Store<{ filters: FilterState }>,
    private notificationService: OpenModalsService,
    public dialog: MatDialog,
    private notificationDataService: NotificationDataService,
    private router: Router,
    private moduleServices: EnergyProductionService) {

    this.generalFilters$ = this.store.select(state => state.filters.generalFilters);

    this.pageSizeSub = this.store.select(selectPageSize).subscribe(size => {
      this.pageSize = size;
      if (this.paginator) this.paginator.pageSize = size;
    });

    this.pageIndexSub = this.store.select(selectPageIndex).subscribe(index => {
      this.pageIndex = index + 1;
      if (this.paginator) this.paginator.pageIndex = index;
      this.getData(index + 1, this.searchValue);
    });

    this.drawerOpenSub = this.store.select(selectDrawer).subscribe((resp: DrawerGeneral) => {
      this.drawerOpenPlant = resp.drawerOpen;
      this.drawerAction = resp.drawerAction;
      this.drawerInfo = resp.drawerInfo;
      if (resp.needReload) this.getData(1, this.searchValue);
    });
  }

  ngOnInit(): void {
    this.setYear()
  };

  ngAfterViewInit(): void {
    this.searchBar.valueChanges.pipe(debounceTime(500), takeUntil(this.onDestroy$)).subscribe(content => {
      this.getData(1, content)
    })
  }

  changePageSize(event: any) {
    this.pageSize = event.value;
    this.paginator.pageSize = this.pageSize;
    this.paginator._changePageSize(this.pageSize);
  }

  setYear() {
    this.generalFilters$.subscribe((generalFilters: GeneralFilters) => {
      this.selectedYear = generalFilters.year
      this.getData(1, this.searchValue);
    });
  }

  getDataResponse(page: number, name: string) {
    this.moduleServices.getEnergyProdData(this.selectedYear, name, this.pageSize, page).subscribe({
      next: (response: entity.DataEnergyProdTablMapper) => {
        this.dataSource.data = response?.data;
        this.totalItems = response?.totalItems;
        this.dataSource.sort = this.sort;
        this.pageIndex = page!
      },
      error: error => {
        this.notificationService.notificacion(`Talk to the administrator.`, 'alert');
        console.log(error);
      }
    });
  }

  getConsumptionDataResponse(page: number, name: string) {
    this.moduleServices.getEnergyConsumptionData(this.selectedYear, name, this.pageSize, page).subscribe({
      next: (response: entity.DataEnergyProdTablMapper) => {
        this.dataSource.data = response?.data;
        this.totalItems = response?.totalItems;
        this.dataSource.sort = this.sort;
        this.pageIndex = page!
      },
      error: error => {
        this.notificationService.notificacion(`Talk to the administrator.`, 'alert');
        console.log(error);
      }
    });
  }

  getEstimatedDataResponse(page: number, name: string) {
    this.moduleServices.getEnergyEstimatedData(this.selectedYear, name, this.pageSize, page).subscribe({
      next: (response: entity.DataEnergyProdTablMapper) => {
        this.dataSource.data = response?.data;
        this.totalItems = response?.totalItems;
        this.dataSource.sort = this.sort;
        this.pageIndex = page!
      },
      error: error => {
        this.notificationService.notificacion(`Talk to the administrator.`, 'alert');
        console.log(error);
      }
    });
  }

  editClient(data: entity.DataEnergyProdTable, month: number, monthName: string, energyEdited: number) {
    console.log(energyEdited)
    let objData: any = {
      id: data.id,
      siteName: data?.siteName,
      year: this.selectedYear,
      monthSelected: month,
      monthSelectedName: monthName,
      energyValue: energyEdited? energyEdited : '',
      isCreated: data.isCreated,
      energyType: this.selectedEnergyType
    }
    console.log(objData)
    this.editedClient = objData
    this.updDraweStateEdit(true);
  }

  updDraweStateEdit(estado: boolean): void {
    this.store.dispatch(updateDrawer({ drawerOpen: estado, drawerAction: "Edit", drawerInfo: this.editedClient, needReload: false }));
  }

  toggleDrawer() {
    this.updDraweState(!this.drawerOpenPlant);
  }

  toggleDrawerClient(data?: any) {
    this.editedClient = data
    this.drawerOpenPlant = !this.drawerOpenPlant
    this.updDraweState(this.drawerOpenPlant);
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

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    this.uploadExcel();
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

  updDraweState(estado: boolean): void {
    this.store.dispatch(updateDrawer({ drawerOpen: estado, drawerAction: "Create", drawerInfo: null, needReload: false }));
  }

  getServerData(event: PageEvent): void {
    this.store.dispatch(updatePagination({ pageIndex: event.pageIndex, pageSize: event.pageSize }));
    this.getData(event.pageIndex + 1, this.searchValue);
  }

  navigate(link: string) {
    this.router.navigateByUrl(link);
  }

  completionMessage(load: boolean) {
    this.notificationService.notificacion(`Excel ${load ? 'Loaded' : 'Downloaded'}.`, 'save')
    this.getDataResponse(1, this.searchBar?.value || '');
  }

  onEnergyTypeChange(event: any): void {
    const selectedValue = event.value;
    this.selectedEnergyType = selectedValue;
    console.log(selectedValue)
    if (selectedValue == 1) {
      this.getDataResponse(1, "");
    }
    if (selectedValue == 2) {
      this.getConsumptionDataResponse(1, "");
    }
    if (selectedValue == 3) {
      this.getEstimatedDataResponse(1, "");
    }
  }

  getData(page: number, content?: string | null) {
    if (this.selectedEnergyType == 1) {
      this.getDataResponse(page, content!);
    }
    if (this.selectedEnergyType == 2) {
      this.getConsumptionDataResponse(page, content!);
    }
    if (this.selectedEnergyType == 3) {
      this.getEstimatedDataResponse(page, content!);
    }
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

export function getPaginatorIntl() {
  const paginatorIntl = new MatPaginatorIntl();

  paginatorIntl.getRangeLabel = (page: number, pageSize: number, length: number) => {
    const totalPages = Math.ceil(length / pageSize);
    return `${page + 1} of ${totalPages}`;
  };

  return paginatorIntl;
}