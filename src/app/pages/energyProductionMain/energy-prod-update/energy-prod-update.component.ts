import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { updateDrawer } from '@app/core/store/actions/drawer.actions';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import * as entity from '../energy-production-model';

import { OpenModalsService } from '@app/shared/services/openModals.service';
import { EnergyProductionService } from '../energy-production.service';

@Component({
  selector: 'app-energy-prod-update',
  templateUrl: './energy-prod-update.component.html',
  styleUrl: './energy-prod-update.component.scss'
})
export class EnergyProdUpdateComponent implements OnInit, OnDestroy {
  private onDestroy$ = new Subject<void>();
  private _equipment?: any | null | undefined;

  get equipment(): any | null | undefined { return this._equipment }

  @Input() isOpen = false;
  @Input() modeDrawer: "Edit" | "Create" = "Create";
  @Input() set equipment(editedData: any | null | undefined) {
    console.log(editedData);

    if (editedData) {
      this.editedClient = editedData;
      this.formData.patchValue({
        ...editedData,
        name: editedData?.nombre,
        tipoDeClienteId: editedData?.tipoDeCliente?.id
      })
    }
  }

  formData = this.fb.group({
    nameSite: [{value: 'Linda Vista', disabled:true}, Validators.required],
    month: [{value: 'September', disabled:true}, Validators.required],
    year: [{value: '2024', disabled:true}, Validators.required],
    energyProduction: [{value: '', disabled:false}, Validators.required],
  });

  cattypesClients: entity.DataCatalogTypeClient[] = []
  editedClient: any;

  imagePreview: string | ArrayBuffer | null = null;

  constructor(
    private moduleServices: EnergyProductionService,
    private notificationService: OpenModalsService,
    private store: Store,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.getCatalogs();
  }

  getCatalogs() {
    // this.moduleServices.getTypeClientsData().subscribe({
    //   next: (response: entity.DataCatalogTypeClient[]) => this.cattypesClients = response,
    //   error: (error) => {
    //     this.notificationService.notificacion(`Talk to the administrator.`, 'alert')
    //     console.error(error)
    //   }
    // })
  }

  actionSave() {
    if (!this.formData.valid) return

    const objData: any = { ...this.formData.value };
    console.log('objData', objData);
    // if (!this.editedClient?.id) delete objData.clientId
    // if (this.editedClient?.id) this.saveDataPatch(objData);
    // else this.saveDataPost(objData);
  }

  saveDataPost(objData: entity.DataPostClient) {
    // this.moduleServices.postDataClient(objData).subscribe({
    //   next: () => { this.completionMessage() },
    //   error: (error) => {
    //     this.notificationService.notificacion(`Hable con el administrador.`, 'alert');
    //     console.error(error)
    //   }
    // })
  }

  
  validateInput(event: any): void {
    const inputValue = event.target.value;
    
    if (inputValue <= 0) {
      event.target.value = '';
      this.formData.controls['energyProduction'].setValue('');
    }
  }

  saveDataPatch(objData: entity.DataPatchClient) {
    // this.moduleServices.patchDataClient(this.editedClient?.id!, objData).subscribe({
    //   next: () => { this.completionMessage(true) },
    //   error: (error) => {
    //     this.notificationService.notificacion(`Hable con el administrador.`, 'alert');
    //     console.error(error)
    //   }
    // })
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      // this.formData.get('image')?.setValue(file);

      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    if (event.dataTransfer && event.dataTransfer.files.length > 0) {
      const file = event.dataTransfer.files[0];
      // this.formData.get('image')?.setValue(file);

      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage(event: Event) {
    event.stopPropagation();
    this.imagePreview = null;
    // this.formData.get('image')?.setValue(null);
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
  }

  cancelEdit() {
    this.formData.reset();
    this.formData.markAsPristine();
    this.formData.markAsUntouched();
    this.editedClient = null;
  }

  closeDrawer() {
    this.isOpen = false;
    setTimeout(() => this.cancelEdit(), 300);
    this.store.dispatch(updateDrawer({ drawerOpen: false, drawerAction: "Create", drawerInfo: null, needReload: true }));
  }

  completionMessage(edit = false) {
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
