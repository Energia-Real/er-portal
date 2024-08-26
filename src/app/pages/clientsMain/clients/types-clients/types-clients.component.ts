import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { updateDrawer } from '@app/core/store/actions/drawer.actions';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import * as entity from '../../clients-model';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { updatePagination } from '@app/core/store/actions/paginator.actions';
import { ClientsService } from '../../clients.service';
import { OpenModalsService } from '@app/shared/services/openModals.service';
import { DataCatalogs } from '@app/shared/models/catalogs-models';

@Component({
  selector: 'app-types-clients',
  templateUrl: './types-clients.component.html',
  styleUrl: './types-clients.component.scss'
})
export class TypesClientsComponent implements OnInit, OnDestroy {
  private onDestroy = new Subject<void>();
  dataSource = new MatTableDataSource<any>([]);
  @ViewChild(MatPaginator,{ static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;
  pageSizeOptions: number[] = [5, 10, 20, 50];
  pageSize: number = 5;
  pageIndex: number = 1 ;
  totalItems: number = 0;
  displayedColumns: string[] = [
    'description', 
    'actions'
  ];

//   ngAfterViewChecked() {
//     if (this.paginator) {
//       this.paginator.pageIndex = this.pageIndex - 1; 
//     } else {
//       console.error('Paginator no está definido');
//     }
// }

  private _equipment?: any | null | undefined;
  get equipment(): any | null | undefined {
    return this._equipment;
  }

  @Input() isOpen = false;
  @Input() modeDrawer: "Edit" | "Create" = "Create";
  @Input() plantCode?:string;
  @Input() set equipment(value: any | null | undefined) {
    this._equipment = value;
  }

  formData = this.fb.group({
    description: ['', Validators.required],
  });

  loading: boolean = false;
  isEdit: boolean = false;

  searchValue: string = '';

  constructor(
    private moduleServices: ClientsService,
    private notificationService: OpenModalsService,
    private fb: FormBuilder,
    private store: Store
  ) { }

  ngOnInit() {
   console.log(this.isOpen);
   this.getDataTable();
  }
  
  actionSave() {
   console.log(this.formData.value);
   this.cancelEdit()
  }

  getDataTable() {
    this.moduleServices.getTypeClientsData().subscribe({
      next: (response : DataCatalogs[]) => {
        this.dataSource.data = response;
      },
      error: error => {
        this.notificationService.notificacion(`Talk to the administrator.`, 'alert');
        console.log(error);
      }
    });
  }

  edit(data:any) {
    this.formData.get('description')?.patchValue(data.tipo)
    this.isEdit = true;
  }

  cancelEdit() {
    this.formData.reset()
    this.isEdit = false;
  }

  closeDrawer() {
    this.isOpen = false;
    this.store.dispatch(updateDrawer({drawerOpen:false, drawerAction: "Create", drawerInfo: null,needReload:true}));
  }

  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.unsubscribe();
  }
}
