import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { updateDrawer } from '@app/core/store/actions/drawer.actions';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import * as entity from '../../clients-model';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { ClientsService } from '../../clients.service';
import { OpenModalsService } from '@app/shared/services/openModals.service';
import { DataCatalogs } from '@app/shared/models/catalogs-models';

@Component({
  selector: 'app-types-clients',
  templateUrl: './types-clients.component.html',
  styleUrl: './types-clients.component.scss'
})
export class TypesClientsComponent implements OnInit, OnDestroy {
  private onDestroy$ = new Subject<void>();

  dataSource = new MatTableDataSource<any>([]);
  @ViewChild(MatSort, { static: false }) sort!: MatSort;
  displayedColumns: string[] = [
    'description',
    'actions'
  ];

  @Input() isOpen = false;

  description = new FormControl('');

  loading: boolean = false;

  editedClient !: entity.DataPostTypeClient | entity.DataPostTypeClient | null;

  searchValue: string = '';

  constructor(
    private moduleServices: ClientsService,
    private notificationService: OpenModalsService,
    private store: Store
  ) { }

  ngOnInit() {
    console.log(this.isOpen);
    this.getDataTable();
  }

  actionSave() {
    let objData: entity.DataPostPatchTypeClient = {}

    if (this.editedClient?.id) {
      objData.tipo = this.description.value!
      this.saveDataPatch(objData)
    } else {
      objData.description = this.description.value!
      this.saveDataPost(objData)
    }
  }

  getDataTable() {
    this.moduleServices.getTypeClientsData().subscribe({
      next: (response: DataCatalogs[]) => {
        this.dataSource.data = response;
        this.dataSource.sort = this.sort;
      },
      error: error => {
        this.notificationService.notificacion(`Talk to the administrator.`, 'alert');
        console.log(error);
      }
    });
  }

  saveDataPost(objData: entity.DataPostTypeClient) {
    this.moduleServices.postDataTypeClients(objData).subscribe({
      next: () => {
        this.completionMessage()
      },
      error: (error) => {
        this.notificationService.notificacion(`Hable con el administrador.`, 'alert')
        console.error(error)
      }
    })
  }

  saveDataPatch(objData: entity.DataPatchTypeClient | entity.DataPostPatchTypeClient) {
    this.moduleServices.patchDataTypeClients(this.editedClient?.id!, objData).subscribe({
      next: () => {
        this.completionMessage(true)
      },
      error: (error) => {
        this.notificationService.notificacion(`Hable con el administrador.`, 'alert')
        console.error(error)
      }
    })
  }

  editTable(data: entity.DataPatchTypeClient) {
    this.description.patchValue(data.tipo);
    this.editedClient = data;
  }

  cancelEdit() {
    this.description.reset();
    this.editedClient = null;
  }

  closeDrawer() {
    this.isOpen = false;
    this.store.dispatch(updateDrawer({ drawerOpen: false, drawerAction: "Create", drawerInfo: null, needReload: true }));
  }

  completionMessage(edit = false) {
    this.notificationService
      .notificacion(`Record ${edit ? 'editado' : 'guardado'}.`, 'save')
      .afterClosed()
      .subscribe((_ => {
        this.cancelEdit();
        this.getDataTable();
      }));
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.unsubscribe();
  }
}
