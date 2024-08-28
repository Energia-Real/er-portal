import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
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

  get equipment(): any | null | undefined { return this._equipment }

  @Input() isOpen = false;
  @Input() modeDrawer: "Edit" | "Create" = "Create";
  @Input() set equipment(editedData: any | null | undefined) {
    this.initializeForm(editedData);
  }

  formData = this.fb.group({
    nombre: ['', Validators.required],
    tipoDeClienteId: [''],
  });


  cattypesClients: entity.DataCatalogTypeClient[] = []
  editedClient!: entity.DataPatchClient | null;

  // FALTA ACTUALIZAR LA TABLA DE CLIENTES AL CREAR UNO Y CERRAR  
  // FALTA EDITAR EDITAR EL TIPODECLIENTE LO REGRESE EN EL SERVICIO DE LA TABLA

  constructor(
    private moduleServices: ClientsService,
    private notificationService: OpenModalsService,
    private store: Store,
    private fb: FormBuilder
  ) {
  }

  ngOnInit() {
    this.getCatalogs();
  }

  getCatalogs() {
    this.moduleServices.getTypeClientsData().subscribe({
      next: (response: entity.DataCatalogTypeClient[]) => this.cattypesClients = response,
      error: (error) => {
        this.notificationService.notificacion(`Talk to the administrator.`, 'alert')
        console.error(error)
      }
    })
  }

  actionSave() {
    let objData: any = { ...this.formData.value };

    console.log('objData', objData);

    if (this.editedClient?.clientId) this.saveDataPatch(objData)
       else this.saveDataPost(objData)
  }

  saveDataPost(objData: entity.DataPostClient) {
    this.moduleServices.postDataClient(objData).subscribe({
      next: () => {
        this.completionMessage()
      },
      error: (error) => {
        this.notificationService.notificacion(`Hable con el administrador.`, 'alert')
        console.error(error)
      }
    })
  }

  saveDataPatch(objData: entity.DataPatchClient) {
    this.moduleServices.patchDataClient(this.editedClient?.clientId!, objData).subscribe({
      next: () => {
        this.completionMessage(true)
      },
      error: (error) => {
        this.notificationService.notificacion(`Hable con el administrador.`, 'alert')
        console.error(error)
      }
    })
  }

  initializeForm(data: any) {
    this.formData.patchValue(data)
  }

  editTable(data: entity.DataPatchClient) {
    this.formData.patchValue(data);
    this.editedClient = data;
  }

  cancelEdit() {
    this.formData.reset();
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
      .subscribe((_ => this.cancelEdit()));
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.unsubscribe();
  }
}
