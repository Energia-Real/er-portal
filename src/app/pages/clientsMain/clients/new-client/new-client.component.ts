import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { updateDrawer } from '@app/core/store/actions/drawer.actions';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import * as entity from '../../clients-model';
import { ClientsService } from '../../clients.service';
import { OpenModalsService } from '@app/shared/services/openModals.service';
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
    console.log(editedData);
    
    this.formData.patchValue({
        ...editedData,
        name : editedData?.nombre
      })
  }

  formData = this.fb.group({
    name: ['', Validators.required],
    tipoDeClienteId: [''],
  });

  loading: boolean = false;

  cattypesClients: entity.DataCatalogTypeClient[] = []
  editedClient!: entity.DataPatchClient | null;

  // FALTA EDITAR EDITAR EL TIPODECLIENTE LO REGRESE EN EL SERVICIO DE LA TABLA

  constructor(
    private moduleServices: ClientsService,
    private notificationService: OpenModalsService,
    private store: Store,
    private fb: FormBuilder
  ) { }

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
    if (!this.formData.valid) return
    
    const objData: any = { ...this.formData.value };
    this.loading = !this.loading;

    if (this.editedClient?.clientId) this.saveDataPatch(objData)
    else this.saveDataPost(objData)
}

  saveDataPost(objData: entity.DataPostClient) {
    this.moduleServices.postDataClient(objData).subscribe({
      next: () => {
        this.completionMessage()
      },
      error: (error) => {
        this.notificationService.notificacion(`Hable con el administrador.`, 'alert');
        this.loading = !this.loading;
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
        this.notificationService.notificacion(`Hable con el administrador.`, 'alert');
        this.loading = !this.loading;
        console.error(error)
      }
    })
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
    setTimeout(() => {
      this.cancelEdit();
    }, 300);
    this.store.dispatch(updateDrawer({ drawerOpen: false, drawerAction: "Create", drawerInfo: null, needReload: true }));
  }

  completionMessage(edit = false) {
    this.loading = !this.loading;
    this.notificationService
      .notificacion(`Record ${edit ? 'editado' : 'guardado'}.`, 'save')
      .afterClosed()
      .subscribe((_ => this.closeDrawer()));
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.unsubscribe();
  }
}
