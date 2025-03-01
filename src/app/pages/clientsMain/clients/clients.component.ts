import { AfterViewChecked, AfterViewInit, Component, OnDestroy, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ClientsService } from '../clients.service';
import { Subject, Subscription, debounceTime, takeUntil } from 'rxjs';
import * as entity from '../clients-model';
import { OpenModalsService } from '@app/shared/services/openModals.service';
import { Store } from '@ngrx/store';
import { selectPageIndex, selectPageSize } from '@app/core/store/selectors/paginator.selector';
import { updatePagination } from '@app/core/store/actions/paginator.actions';
import { FormControl } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { corporateDrawer, updateDrawer } from '@app/core/store/actions/drawer.actions';
import { selectDrawer } from '@app/core/store/selectors/drawer.selector';
import { DrawerGeneral } from '@app/shared/models/general-models';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.scss'
})
export class ClientsComponent implements OnDestroy, AfterViewChecked, AfterViewInit {
  private onDestroy$ = new Subject<void>();
  dataSource = new MatTableDataSource<any>([]);
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;
  pageSizeOptions: number[] = [5, 10, 20, 50];
  pageSize: number = 5;
  pageIndex: number = 1;
  totalItems: number = 0;

  ngAfterViewChecked() {
    if (this.paginator) this.paginator.pageIndex = this.pageIndex - 1;
    else console.error('Paginator no está definido');
  }

  displayedColumns: string[] = [
    'image',
    'clientName',
    'clientId',
    'typeClient',
    'corporateName',
    'actions',
  ];


  totalPlants: any;

  searchValue: string = '';
  drawerAction: "Create" | "Edit" = "Create";
  drawerAction2: "Create" | "Edit" = "Create";
  drawerInfo: any | null | undefined = null;

  showLoader: boolean = true;
  drawerOpen: boolean = false;
  drawerOpenClient: boolean = false;
  drawerOpenCorporateName: boolean = false;

  needReload: boolean = false;

  loadingtotalPlants: boolean = true;

  pageSizeSub: Subscription;
  pageIndexSub: Subscription;

  searchBar = new FormControl('');
  drawerOpenSub: Subscription;
  drawerOpenSubClient: Subscription;

  editedClient: any;

  constructor(
    private store: Store, 
    private moduleServices: ClientsService, 
    private notificationService: OpenModalsService, 
    private router: Router,
  ) {
    this.pageSizeSub = this.store.select(selectPageSize).subscribe(size => {
      this.pageSize = size;
      if (this.paginator) this.paginator.pageSize = size;
    });

    this.pageIndexSub = this.store.select(selectPageIndex).subscribe(index => {
      this.pageIndex = index + 1;
      if (this.paginator) this.paginator.pageIndex = index;
      this.getDataTable(index + 1, this.searchValue);
    });

    this.drawerOpenSub = this.store.select(selectDrawer).subscribe((resp: DrawerGeneral) => {
      if (!this.drawerOpenClient && !this.editedClient) {
        this.drawerOpen = resp.drawerOpen;
        this.drawerAction = resp.drawerAction;
        this.drawerInfo = resp.drawerInfo;
      }
    });

    this.drawerOpenSubClient = this.store.select(selectDrawer).subscribe((resp: DrawerGeneral) => {

      if (this.drawerOpenClient || this.editedClient?.id) {
        this.drawerOpenClient = resp.drawerOpen;
        this.drawerAction = resp.drawerAction;
        this.drawerInfo = resp.drawerInfo;
        if (resp.needReload) this.getDataTable(1, '');
      }
    });
  }

  ngAfterViewInit(): void {
    this.searchBar.valueChanges.pipe(debounceTime(500), takeUntil(this.onDestroy$)).subscribe(content => {
      this.getDataTable(1, content!);
    })
  }

  getDataTable(page: number, name: string) {
    this.moduleServices.getClientsData(name, this.pageSize, page).subscribe({
      next: (response: entity.DataTableResponse) => {
        this.dataSource.data = response?.data;
        this.totalItems = response?.totalItems;
        this.dataSource.sort = this.sort;
        this.pageIndex = page;
      },
      error: error => {
        this.notificationService.notificacion(`Talk to the administrator.`, 'alert');
      }
    });
  }

  editClient(data: any) {
    this.editedClient = data
    this.updDraweStateEdit(true);
  }

  updDraweStateEdit(estado: boolean): void {
    this.store.dispatch(updateDrawer({ drawerOpen: estado, drawerAction: "Edit", drawerInfo: this.editedClient, needReload: false }));
  }

  updCorporateDrawer(id:string, name: string){
    this.store.dispatch(corporateDrawer({ drawerOpen: true, clientId: id, clientName: name}));

  }

  toggleDrawer() {
    this.updDraweState(!this.drawerOpen);
  }

  toggleDrawerClient(data?: any) {
    this.editedClient = data
    this.drawerOpenClient = !this.drawerOpenClient
    this.updDraweState(this.drawerOpenClient);
  }

  toggleDrawerCorporateName( id: string, name:string) {
    this.updCorporateDrawer(id,name)
    this.drawerOpenCorporateName = !this.drawerOpenCorporateName
  }

  updDraweState(estado: boolean): void {
    this.store.dispatch(updateDrawer({ drawerOpen: estado, drawerAction: "Create", drawerInfo: null, needReload: false }));
  }

  getServerData(event: PageEvent): void {
    this.store.dispatch(updatePagination({ pageIndex: event.pageIndex, pageSize: event.pageSize }));
    this.getDataTable(event.pageIndex + 1, this.searchValue);
  }

  navigate(link: string) {
    this.router.navigateByUrl(link);
  }

  changePageSize(event: any) {
    this.pageSize = event.value;
    this.paginator.pageSize = this.pageSize;
    this.paginator._changePageSize(this.pageSize);
  }

  corporateEmitter(emit: boolean){
    this.drawerOpenCorporateName = false;
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.unsubscribe();
  }
}
