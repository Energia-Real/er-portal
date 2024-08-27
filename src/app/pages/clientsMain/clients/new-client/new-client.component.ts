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
  selector: 'app-new-client',
  templateUrl: './new-client.component.html',
  styleUrl: './new-client.component.scss'
})
export class NewClientComponent implements OnInit, OnDestroy {
  private onDestroy$ = new Subject<void>();
  private _equipment?: any | null | undefined;


  dataSource = new MatTableDataSource<any>([]);
  @ViewChild(MatSort, { static: false }) sort!: MatSort;
  displayedColumns: string[] = [
    'description',
    'actions'
  ];

  get equipment(): any | null | undefined { return this._equipment }

  @Input() isOpen = false;
  @Input() modeDrawer: "Edit" | "Create" = "Create";
  @Input() plantCode?: string;
  @Input() set equipment(value: any | null | undefined) {
    this._equipment = value;
  }

  editedClient: any

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
      this.saveDataPatch(objData)
    } else {
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
    // this.description.patchValue(data.tipo);
    this.editedClient = data;
  }

  cancelEdit() {
    // this.description.reset();
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
