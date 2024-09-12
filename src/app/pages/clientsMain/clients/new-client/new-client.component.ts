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
  private _client?: any | null | undefined;

  get client(): any | null | undefined { return this._client }

  @Input() isOpen = false;
  @Input() modeDrawer: "Edit" | "Create" = "Create";
  @Input() set client(editedData: any | null | undefined) {
    if (editedData) {
      this.editedClient = editedData;
      this.imagenSelectedEdit = editedData.imageBase64;
      this.formData.patchValue({
        ...editedData,
        name: editedData?.nombre,
        tipoDeClienteId: editedData?.tipoDeCliente?.id
      })
    }
  }

  formData = this.fb.group({
    name: ['', Validators.required],
    tipoDeClienteId: ['', Validators.required],
    clientId: [''],
    image: [null as File | null]
  });

  cattypesClients: entity.DataCatalogTypeClient[] = []
  editedClient: any;

  imagePreview: string | ArrayBuffer | null = null;
  imageFile: File | null = null;

  insertedImage:boolean = false
  imagenSelectedEdit:any

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
    if (!this.formData.valid) return;

    let objData: any = { ...this.formData.value }
    if (this.editedClient?.id) objData.clientId = this.formData.get('clientId')?.value;

    if (this.editedClient?.id) this.saveDataPatch(objData);
    else this.saveDataPost(objData);
  }

  saveDataPost(objData: any) {
    this.moduleServices.postDataClient(objData).subscribe({
      next: () => { this.completionMessage() },
      error: (error) => {
        this.notificationService.notificacion(`Hable con el administrador.`, 'alert');
        console.error(error)
      }
    })
  }

  saveDataPatch(objData: any) {
    this.moduleServices.patchDataClient(this.editedClient?.id!, objData).subscribe({
      next: () => { this.completionMessage(true) },
      error: (error) => {
        this.notificationService.notificacion(`Hable con el administrador.`, 'alert');
        console.error(error)
      }
    })
  }

  onFileChange(event: any) {
    this.insertedImage = true;
    const file = event.target.files[0];

    if (file) {
      this.formData.patchValue({ image: file });
      const reader = new FileReader();
      reader.onload = () => { this.imagePreview = reader.result };
      reader.readAsDataURL(file);
    }
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    if (event.dataTransfer && event.dataTransfer.files.length > 0) {
      const file = event.dataTransfer.files[0];
      this.formData.get('image')?.setValue(file);
  
      const reader = new FileReader();
      reader.onload = () => { this.imagePreview = reader.result };
      reader.readAsDataURL(file);
    }
  }

  removeImage(event: Event, fileInput: HTMLInputElement) {
    event.stopPropagation();
    this.imagePreview = null;
    this.imagenSelectedEdit = null;
    this.formData.get('image')?.setValue(null);
    fileInput.value = '';
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
    this.imagenSelectedEdit = null;
    this.imagePreview = null;
  }

  closeDrawer(cancel?:boolean) {
    this.isOpen = false;
    setTimeout(() => this.cancelEdit(), 300);
    this.store.dispatch(updateDrawer({ drawerOpen: false, drawerAction: "Create", drawerInfo: null, needReload: cancel ? false : true }));
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
