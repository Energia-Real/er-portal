import { AfterViewInit, Component, OnDestroy, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ClientsService } from '../clients.service';
import { Subject, Subscription, combineLatest, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
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
export class ClientsComponent implements OnDestroy, AfterViewInit {
  private onDestroy$ = new Subject<void>();
  dataSource = new MatTableDataSource<any>([]);
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;
  pageSizeOptions: number[] = [5, 10, 20, 50];
  pageSize: number = 5;
  pageIndex: number = 1;
  totalItems: number = 0;

  displayedColumns: string[] = [
    'image',
    'clientName',
    'clientId',
    'typeClient',
    'corporateName',
    'actions',
  ];

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

  searchBar = new FormControl('');
  drawerOpenSub!: Subscription;

  editedClient: any;

  constructor(
    private store: Store,
    private moduleServices: ClientsService,
    private notificationService: OpenModalsService,
    private router: Router,
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

          this.getClients();
        }
      });

    this.drawerOpenSub = this.store.select(selectDrawer)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((resp: DrawerGeneral) => {
        this.drawerAction = resp.drawerAction;
        this.drawerInfo = resp.drawerInfo;

        if (!this.drawerOpenClient && !this.editedClient) this.drawerOpen = resp.drawerOpen;

        if (this.drawerOpenClient || this.editedClient?.id) {
          this.drawerOpenClient = resp.drawerOpen;
          if (resp.needReload) this.getClients();
        }
      });
  }

  ngAfterViewInit(): void {
    if (this.paginator) this.paginator.pageIndex = this.pageIndex - 1;
    else console.error('Paginator no está definido');

    this.searchBar.valueChanges.pipe(debounceTime(500), takeUntil(this.onDestroy$))
      .subscribe(content => this.getClients(content!));
  }

  getClients(name = '') {
    const filters: entity.FiltersClients = {
      pageSize: this.pageSize,
      page: this.pageIndex,
      name
    };

    this.moduleServices.getClientsData(filters).subscribe({
      next: (response: entity.DataTableResponse) => {
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

  editClient(data: any) {
    this.editedClient = data
    this.updDraweStateEdit(true);
  }

  updDraweStateEdit(estado: boolean): void {
    this.store.dispatch(updateDrawer({ drawerOpen: estado, drawerAction: "Edit", drawerInfo: this.editedClient, needReload: false }));
  }

  updCorporateDrawer(id: string, name: string) {
    this.store.dispatch(corporateDrawer({ drawerOpen: true, clientId: id, clientName: name }));
  }

  toggleDrawer() {
    this.updDraweState(!this.drawerOpen);
  }

  toggleDrawerClient(data?: any) {
    this.editedClient = data
    this.drawerOpenClient = !this.drawerOpenClient
    this.updDraweState(this.drawerOpenClient);
  }

  toggleDrawerCorporateName(id: string, name: string) {
    this.updCorporateDrawer(id, name)
    this.drawerOpenCorporateName = !this.drawerOpenCorporateName
  }

  updDraweState(estado: boolean): void {
    this.store.dispatch(updateDrawer({ drawerOpen: estado, drawerAction: "Create", drawerInfo: null, needReload: false }));
  }

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

    this.getClients();
  }

  getServerData(event: PageEvent): void {
    if (event.pageSize !== this.pageSize || event.pageIndex !== this.pageIndex - 1) {
      this.store.dispatch(updatePagination({ pageIndex: event.pageIndex, pageSize: event.pageSize }));
    }
  }

  corporateEmitter(emit: boolean){
    this.drawerOpenCorporateName = false;
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
    this.drawerOpenSub.unsubscribe();
  }
}
