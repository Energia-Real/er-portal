import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { updateDrawer } from '@app/core/store/actions/drawer.actions';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import * as entity from '../clients-model';
import { ClientsService } from '../clients.service';
import { OpenModalsService } from '@app/shared/services/openModals.service';
import { MatDialog } from '@angular/material/dialog';
import { NotificationComponent } from '@app/shared/components/notification/notification.component';
import { NOTIFICATION_CONSTANTS } from '@app/core/constants/notification-constants';
import { notificationData, NotificationMessages } from '@app/shared/models/general-models';
import { NotificationDataService } from '@app/shared/services/notificationData.service';
import{NotificationServiceData,EditNotificationStatus}from '@app/shared/models/general-models';
import { AuthService } from '@app/auth/auth.service';
import { NotificationService } from '@app/shared/services/notification.service';

@Component({
  selector: 'app-new-client',
  templateUrl: './new-client.component.html',
  styleUrl: './new-client.component.scss'
})
export class NewClientComponent implements OnInit, OnDestroy {
  ADD=NOTIFICATION_CONSTANTS.ADD_CONFIRM_TYPE;
  CANCEL=NOTIFICATION_CONSTANTS.CANCEL_TYPE;
  EDIT=NOTIFICATION_CONSTANTS.EDIT_CONFIRM_TYPE;
  DELETE=NOTIFICATION_CONSTANTS.DELETE;

  private onDestroy$ = new Subject<void>();
  private _client?: any | null | undefined;
  private notificationId?: string;

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
        tipoDeClienteId: editedData?.tipoDeCliente?.id,
        clientId: editedData?.clientId
      })
    }
  }

  formData = this.fb.group({
    name: ['', Validators.required],
    tipoDeClienteId: ['', Validators.required],
    clientId: ['', Validators.maxLength(4)],
    image: [null as File | null]
  });

  cattypesClients: entity.DataCatalogTypeClient[] = []
  editedClient: any;

  imagePreview: string | ArrayBuffer | null = null;
  imageFile: File | null = null;

  insertedImage:boolean = false
  imagenSelectedEdit:any
  user:any;

  constructor(
    private moduleServices: ClientsService,
    private notificationService: OpenModalsService,
    private store: Store,
    private fb: FormBuilder,
    public dialog: MatDialog,
    private notificationDataService: NotificationDataService,
    private authService: AuthService,
    private notificationsService: NotificationService
  ) { }

  ngOnInit() {
    this.getCatalogs();
    this.authService.getInfoUser().subscribe(res=>{
      this.user=res
    })
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

  actionSave(){
    if (this.editedClient?.id) this.createNotificationModal(this.EDIT);
    else this.createNotificationModal(this.ADD);
  }

 

  saveDataPost(notificationmessages:NotificationMessages) {
    let objData: any = { ...this.formData.value }
    this.moduleServices.postDataClient(objData,notificationmessages).subscribe({
    })
  }

  saveDataPatch(notificationmessages:NotificationMessages) {
    let objData: any = { ...this.formData.value }
    if (this.editedClient?.id) objData.clientId = this.formData.get('clientId')?.value;
    this.moduleServices.patchDataClient(this.editedClient?.id!, objData,notificationmessages).subscribe({
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
 

  createNotificationModal(notificationType:string){
    const dataNotificationModal:notificationData|undefined = this.notificationDataService.clientsNotificationData(notificationType);
    const dataNotificationService:NotificationServiceData= {
                                                            userId:this.user.id,
                                                            descripcion:dataNotificationModal?.title,
                                                            notificationTypeId:dataNotificationModal?.typeId,
                                                            notificationStatusId:this.notificationsService.getNotificationStatusByName(NOTIFICATION_CONSTANTS.INPROGRESS_STATUS).id
                                                          } 
    this.notificationsService.createNotification(dataNotificationService).subscribe(res=>{
      this.notificationId=res.response.externalId;
    })
    
    const dialogRef = this.dialog.open(NotificationComponent, {
      width: '540px',     
      data: dataNotificationModal
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.confirmed && this.notificationId) {
        switch(result.action){
          case this.ADD:
            let snackMessagesAdd:NotificationMessages = {
              completedTitleSnack:NOTIFICATION_CONSTANTS.ADD_CLIENT_COMPLETE_TITLE,
              completedContentSnack:NOTIFICATION_CONSTANTS.ADD_CLIENT_COMPLETE_CONTENT,
              errorTitleSnack:'',
              errorContentSnack:'',
              notificationId:this.notificationId,
              successCenterMessage:NOTIFICATION_CONSTANTS.ADD_CLIENT_SUCCESS,
              errorCenterMessage:NOTIFICATION_CONSTANTS.ADD_CLIENT_ERROR,
              userId:this.user.id
            }
            this.saveDataPost(snackMessagesAdd);
            this.closeDrawer(true)
            return;
          case this.EDIT:
            let snackMessagesEdit:NotificationMessages = {
              completedTitleSnack:NOTIFICATION_CONSTANTS.EDIT_CLIENT_COMPLETE_TITLE,
              completedContentSnack:NOTIFICATION_CONSTANTS.EDIT_CLIENT_COMPLETE_CONTENT,
              errorTitleSnack:'',
              errorContentSnack:'',
              notificationId:this.notificationId,
              successCenterMessage:NOTIFICATION_CONSTANTS.EDIT_CLIENT_SUCCESS,
              errorCenterMessage:NOTIFICATION_CONSTANTS.EDIT_CLIENT_ERROR,
              userId:this.user.id
            }
            this.saveDataPatch(snackMessagesEdit)
            this.closeDrawer(true)
            return;
          case this.CANCEL: 
            let editStatusData={
              externalId: this.notificationId,
              status: this.notificationsService.getNotificationStatusByName(NOTIFICATION_CONSTANTS.COMPLETED_STATUS).id
            }
            this.notificationsService.updateNotification(editStatusData).subscribe(res=>{})
            this.closeDrawer(true)
            return 
        }
      } else {
        if(this.notificationId){
          const editStatusData:EditNotificationStatus={
            externalId: this.notificationId,
            status: this.notificationsService.getNotificationStatusByName(NOTIFICATION_CONSTANTS.CANCELED_STATUS).id
          }
          this.notificationsService.updateNotification(editStatusData).subscribe(res=>{})
        }
      }    
    });
  }




  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.unsubscribe();
  }
}
