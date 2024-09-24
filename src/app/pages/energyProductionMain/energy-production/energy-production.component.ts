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
import { EnergyProductionService } from '../energy-production.service';
import * as entity from '../energy-production-model';

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
  pageIndex: number = 1;
  totalItems: number = 0;
  displayedColumns: string[] = [
    'siteName',
    'energyProdMonth1',
    'energyProdMonth2',
    'energyProdMonth3',
    'energyProdMonth4',
    'energyProdMonth5',
    'energyProdMonth6',
    'energyProdMonth7',
    'energyProdMonth8',
    'energyProdMonth9',
    'energyProdMonth10',
    'energyProdMonth11',
    'energyProdMonth12',
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

  drawerOpenPlant: boolean = false;
  drawerAction: "Create" | "Edit" = "Create";
  drawerInfo: any | null | undefined = null;

  editedClient: any;
  selectedYear: any = 2024

  searchValue: string = '';

  searchBar = new FormControl('');

  selectedFile: File | null = null;


  constructor(
    private store: Store,
    private notificationService: OpenModalsService,
    private router: Router,
    private moduleServices: EnergyProductionService) {
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
      this.drawerOpenPlant = resp.drawerOpen;
      this.drawerAction = resp.drawerAction;
      this.drawerInfo = resp.drawerInfo;
      if (resp.needReload) this.getDataResponse(1, this.searchValue);
    });
  }

  ngOnInit(): void {
    this.setYear()
  };

  ngAfterViewInit(): void {
    this.searchBar.valueChanges.pipe(debounceTime(500), takeUntil(this.onDestroy$)).subscribe(content => {
      this.getDataResponse(1, content!);
    })
  }

  setYear() {
    this.selectedYear = this.years[0].value;
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

  editClient(data: entity.DataEnergyProdTable, month: number, monthName: string, energyProduced: number) {
    let objData: any = {
      id: data.id,
      siteName: data?.siteName,
      year: this.selectedYear,
      monthSelected: month,
      monthSelectedName: monthName,
      energyProduced: energyProduced > 0 ? energyProduced : '',
      isCreated: data.isCreated
    }

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
    this.loadExcel();
  }

  loadExcel() {
    if (this.selectedFile) {
      this.moduleServices.loadExcel(this.selectedFile).subscribe({
        next: (response) => {
          this.completionMessage(true);
        },
        error: error => {
          this.notificationService.notificacion(`Talk to the administrator.`, 'alert');
          console.log(error);
        }
      });
    }
  }

  updDraweState(estado: boolean): void {
    this.store.dispatch(updateDrawer({ drawerOpen: estado, drawerAction: "Create", drawerInfo: null, needReload: false }));
  }

  getServerData(event: PageEvent): void {
    this.store.dispatch(updatePagination({ pageIndex: event.pageIndex, pageSize: event.pageSize }));
    this.getDataResponse(event.pageIndex + 1, this.searchValue);
  }

  navigate(link: string) {
    this.router.navigateByUrl(link);
  }

  completionMessage(load: boolean) {
    this.notificationService.notificacion(`Excel ${load ? 'Loaded' : 'Downloaded'}.`, 'save')
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.unsubscribe();
  }
}
