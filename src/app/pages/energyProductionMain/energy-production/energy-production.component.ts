import { AfterViewInit, Component, OnDestroy, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { updateDrawer } from '@app/core/store/actions/drawer.actions';
import { updatePagination } from '@app/core/store/actions/paginator.actions';
import { selectDrawer } from '@app/core/store/selectors/drawer.selector';
import { selectPageIndex, selectPageSize } from '@app/core/store/selectors/paginator.selector';
import { DrawerGeneral, GeneralFilters, notificationData } from '@app/shared/models/general-models';
import { OpenModalsService } from '@app/shared/services/openModals.service';
import { Store } from '@ngrx/store';
import { combineLatest, debounceTime, distinctUntilChanged, Observable, Subject, Subscription, takeUntil } from 'rxjs';
import { EnergyProductionService } from '../energy-production.service';
import * as entity from '../energy-production-model';
import { NotificationComponent } from '@app/shared/components/notification/notification.component';
import { MatDialog } from '@angular/material/dialog';
import { HttpErrorResponse } from '@angular/common/http';
import { NotificationDataService } from '@app/shared/services/notificationData.service';


@Component({
  selector: 'app-energy-production',
  templateUrl: './energy-production.component.html',
  styleUrl: './energy-production.component.scss',
})
export class EnergyProductionComponent implements OnDestroy, AfterViewInit {
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

  drawerOpenSub: Subscription;

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

  newEnergyType: number = 0;
  selectedEnergyType: number = 1;
  generalFilters!: GeneralFilters

  isLoading: boolean = false;

  constructor(
    private store: Store<{ filters: GeneralFilters }>,
    private notificationService: OpenModalsService,
    private dialog: MatDialog,
    private notificationDataService: NotificationDataService,
    private router: Router,
    private moduleServices: EnergyProductionService) {
    this.generalFilters$ = this.store.select(state => state.filters);

    combineLatest([
      this.generalFilters$.pipe(distinctUntilChanged()),
      this.store.select(selectPageSize).pipe(distinctUntilChanged()),
      this.store.select(selectPageIndex).pipe(distinctUntilChanged())
    ])
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(([generalFilters, pageSize, pageIndex]) => {
        const hasYearChanged = this.generalFilters?.year !== generalFilters.year;
        const hasPaginationChanged = this.pageSize !== pageSize || this.pageIndex !== pageIndex + 1;

        if (hasYearChanged || hasPaginationChanged) {
          this.generalFilters = generalFilters;
          this.pageSize = pageSize;
          this.pageIndex = pageIndex + 1;

          if (this.paginator) {
            this.paginator.pageSize = pageSize;
            this.paginator.pageIndex = pageIndex;
          }

          if (!this.isLoading || hasYearChanged) this.getData();
        }
      });

    this.drawerOpenSub = this.store.select(selectDrawer).pipe(takeUntil(this.onDestroy$)).subscribe((resp: DrawerGeneral) => {
      this.drawerOpenPlant = resp.drawerOpen;
      this.drawerAction = resp.drawerAction;
      this.drawerInfo = resp.drawerInfo;
      if (resp.needReload) this.getData(this.searchValue);
    });
  }

  ngAfterViewInit(): void {
    this.alertInformationModal()


    if (this.paginator) this.paginator.pageIndex = this.pageIndex - 1;
    else console.error('Paginator no está definido');

    this.searchBar.valueChanges.pipe(debounceTime(500), takeUntil(this.onDestroy$)).subscribe(content => {
      this.getData(content!);
    })
  }

  getData(name = '', event?: any) {
    this.isLoading = true;
    this.newEnergyType = event?.value || 0;

    if (this.newEnergyType) {
      this.store.dispatch(updatePagination({ pageIndex: 0, pageSize: this.pageSize }));
      this.selectedEnergyType = this.newEnergyType;
    }

    let filters: entity.FiltersEnergyProd = {
      pageSize: this.pageSize,
      page: this.newEnergyType ? 1 : this.pageIndex,
      year: this.generalFilters.year,
      name: name || this.searchBar.value!
    };

    this.getEnergyData(filters, this.selectedEnergyType);
  }

  getEnergyData(filters: entity.FiltersEnergyProd, energyType: number) {
    const services: any = {
      1: this.moduleServices.getEnergyProdData.bind(this.moduleServices),
      2: this.moduleServices.getEnergyConsumptionData.bind(this.moduleServices),
      3: this.moduleServices.getEnergyEstimatedData.bind(this.moduleServices)
    };

    const service = services[energyType] || services[1];

    service(filters).subscribe({
      next: (response: entity.DataEnergyProdTablMapper) => {
        this.dataSource.data = response?.data;
        this.totalItems = response?.totalItems;
        this.dataSource.sort = this.sort;
        this.pageIndex = filters?.page;
        this.isLoading = false;
      },
      error: (error: any) => {
        this.notificationService.notificacion(`Talk to the administrator.`, 'alert');
        console.log(error);
      }
    });
  }

  editClient(data: entity.DataEnergyProdTable, month: number, monthName: string, energyEdited: number) {
    let objData: any = {
      id: data.id,
      siteName: data?.siteName,
      year: this.selectedYear,
      monthSelected: month,
      monthSelectedName: monthName,
      energyValue: energyEdited ? energyEdited : '',
      isCreated: data.isCreated,
      energyType: this.selectedEnergyType
    }
    this.editedClient = objData
    this.updDraweStateEdit(true);
  }

  uploadExcel() {
    if (this.selectedFile) {
      this.moduleServices.uploadExcel(this.selectedFile).subscribe({
        next: (response) => {
          this.alertInformationModal();
        },
        error: (error: HttpErrorResponse) => {
          const errorMessages = error?.error?.errors?.errors.map((e: any) => e.descripcion)
          this.modalErrors(errorMessages);
        }
      });
    }
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

  updDraweStateEdit(estado: boolean): void {
    this.store.dispatch(updateDrawer({ drawerOpen: estado, drawerAction: "Edit", drawerInfo: this.editedClient, needReload: false }));
  }

  updDraweState(estado: boolean): void {
    this.store.dispatch(updateDrawer({ drawerOpen: estado, drawerAction: "Create", drawerInfo: null, needReload: false }));
  }

  changePageSize(event: any) {
    const newSize = event.value;
    this.pageSize = newSize;

    if (this.paginator) {
      this.paginator.pageSize = newSize;
      this.paginator._changePageSize(newSize);
    }

    this.getData();
  }

  getServerData(event: PageEvent): void {
    if (event.pageSize !== this.pageSize || event.pageIndex !== this.pageIndex - 1) {
      this.store.dispatch(updatePagination({ pageIndex: event.pageIndex, pageSize: event.pageSize }));
    }
  }

  navigate(link: string) {
    this.router.navigateByUrl(link);
  }

  modalErrors(errors: any) {
    const dataNotificationModal: notificationData = this.notificationDataService.errors(errors)!;
    this.dialog.open(NotificationComponent, {
      width: '540px',
      data: dataNotificationModal
    })
  }

  alertInformationModal() {
    const dataNotificationModal: notificationData = this.notificationDataService.showNoExcelUpload();

    this.dialog.open(NotificationComponent, {
      width: '540px',
      data: dataNotificationModal
    });
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}