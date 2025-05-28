import { ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { corporate, corporatePlant, DataPostRazonSocial, PlantWhitoutCorporate } from '../clients-model';
import { ClientsService } from '../clients.service';
import { MatMenuTrigger } from '@angular/material/menu';
import { EditNotificationStatus, notificationData, NotificationMessages, NotificationServiceData } from '@app/shared/models/general-models';
import { NotificationService } from '@app/shared/services/notification.service';
import { NotificationDataService } from '@app/shared/services/notificationData.service';
import { EncryptionService } from '@app/shared/services/encryption.service';
import { NOTIFICATION_CONSTANTS } from '@app/core/constants/notification-constants';
import { NotificationComponent } from '@app/shared/components/notification/notification.component';
import { FormBuilder, Validators } from '@angular/forms';
import { TranslationService } from '@app/shared/services/i18n/translation.service';
import { Subject, takeUntil } from 'rxjs';


@Component({
  selector: 'app-edit-corporate-name',
  templateUrl: './edit-corporate-name.component.html',
  styleUrl: './edit-corporate-name.component.scss',
  standalone: false
})
export class EditCorporateNameComponent implements OnInit, OnDestroy {
  private onDestroy$ = new Subject<void>();

  ADD = NOTIFICATION_CONSTANTS.ADD_CONFIRM_TYPE;
  CANCEL = NOTIFICATION_CONSTANTS.CANCEL_TYPE;
  EDIT = NOTIFICATION_CONSTANTS.EDIT_CONFIRM_TYPE;
  DELETE = NOTIFICATION_CONSTANTS.DELETE;
  ERROR = NOTIFICATION_CONSTANTS.ERROR_TYPE;

  private notificationId?: string;


  selectedPlants: any[] = [];


  plants: PlantWhitoutCorporate[] = [
  ]

  plantsFijo: PlantWhitoutCorporate[] = [
  ]

  formData = this.fb.group({
    inputCorporateName: ['', Validators.required],
    rfc: ['', Validators.required],

    plant: ['', Validators.required]
  });

  @ViewChild(MatMenuTrigger) trigger!: MatMenuTrigger;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,

    private moduleServices: ClientsService,
    private cdr: ChangeDetectorRef,
    private notificationsService: NotificationService,
    private notificationDataService: NotificationDataService,
    private encryptionService: EncryptionService,
    public notificationDialog: MatDialog,
    private dialogRef: MatDialogRef<EditCorporateNameComponent>,
    private fb: FormBuilder,
    private translationService: TranslationService
  ) {
    setTimeout(() => {
      this.cdr.detectChanges(); // Fuerza la actualización del HTML
    }, 0);
    this.getPlantsWithoutRS();

  }

  ngOnInit(): void {
    // Subscribe to language changes
    this.translationService.currentLang$
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(() => {
        this.getPlantsWithoutRS();
      });
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }


  addPlant(plant: PlantWhitoutCorporate) {

    let plantWithCorporate: corporatePlant = {//ya que corporatePlant y plantWithoutCorporate son diferentes objetos por regla de negocio debemos hacer un tipo casteo
      id: plant.internalId,
      externalId: plant.externalId,
      plantName: plant.siteName
    }

    if (this.data.razonSocial) {
      this.data.razonSocial.plants.push(plantWithCorporate)
    } else {
      this.selectedPlants.push(plantWithCorporate)
    }
    const index = this.plants.findIndex(item => item.externalId === plant.externalId);//se elimina la planta del dropdown
    if (index !== -1) {
      this.plants.splice(index, 1);
    }


    setTimeout(() => {
      this.cdr.detectChanges(); // Fuerza la actualización del HTML
    }, 0);
  }

  actionSave() {
    if (this.data.razonSocial == null) {
      this.createNotificationModal(this.ADD)
    } else {
      this.createNotificationModal(this.EDIT)
    }

  }

  removePlant(planta: any) {

    let plantWithoutCorporate: PlantWhitoutCorporate = {//ya que corporatePlant y plantWithoutCorporate son diferentes objetos por regla de negocio debemos hacer un tipo casteo
      internalId: planta.id,
      externalId: planta.externalId,
      siteName: planta.plantName
    }

    this.plants.push(plantWithoutCorporate)

    if (this.data.razonSocial) {
      const index = this.data.razonSocial.plants.findIndex((item: { externalId: any; }) => item.externalId === planta.externalId);//se elimina la planta del dropdown
      if (index !== -1) {
        this.data.razonSocial.plants.splice(index, 1);
      }
    }
    else {
      const index = this.selectedPlants.findIndex((item: { externalId: any; }) => item.externalId === planta.externalId);//se elimina la planta del dropdown
      if (index !== -1) {
        this.selectedPlants.splice(index, 1);
      }
    }

    setTimeout(() => {
      this.cdr.detectChanges(); // Fuerza la actualización del HTML
    }, 0);
  }


  getPlantsWithoutRS() {
    this.moduleServices.getPlantsWithoutCorporate().subscribe(resp => {
      this.plants = resp.response.projects
      setTimeout(() => {
        this.cdr.detectChanges(); // Fuerza la actualización del HTML
      }, 0);
    })
  }

  saveDataPatch(notificationmessages: NotificationMessages) {

    let dataArray = [this.data.razonSocial];

    const transformedArray = dataArray.map(item => ({
      id: item.id,
      internalClientId: item.internalClientId,
      corporateName: item.corporateName,
      rfc: item.rfc,
      plants: item.plants.map((plant: { externalId: any; }) => plant.externalId)
    }));

    this.moduleServices.patchRazonSocial(transformedArray, this.data.clientId, notificationmessages).subscribe({
      next: () => {
      },
      error: (error) => {
        const errorArray = error?.error?.errors?.errors ?? [];
        if (errorArray.length) this.createNotificationError(this.ERROR, errorArray[0].title, errorArray[0].descripcion, errorArray[0].warn);
        console.error(error)
      }
    })
  }

  saveDataPost(notificationmessages: NotificationMessages) {
    const corporateName = this.formData.get('inputCorporateName')?.value;
    const rfc = this.formData.get('rfc')?.value;

    const plantIds: string[] = this.selectedPlants.map(plant => plant.externalId);
    let req: DataPostRazonSocial = {
      corporateName: corporateName!,
      plantsIds: plantIds,
      rfc: rfc!
    }
    let reqArray = [req];

    this.moduleServices.postRazonSocial(reqArray, this.data.clientId, notificationmessages).subscribe({
      next: () => {
      },
      error: (error) => {
        const errorArray = error?.error?.errors?.errors ?? [];
        if (errorArray.length) this.createNotificationError(this.ERROR, errorArray[0].title, errorArray[0].descripcion, errorArray[0].warn);
        console.error(error)
      }
    })

  }

  createNotificationModal(notificationType: string) {
    const dataNotificationModal: notificationData | undefined = this.notificationDataService.corporateNotificationData(notificationType);
    const encryptedData = localStorage.getItem('userInfo');
    if (encryptedData) {
      const userInfo = this.encryptionService.decryptData(encryptedData);
      const dataNotificationService: NotificationServiceData = {
        userId: userInfo.id,
        descripcion: dataNotificationModal?.title,
        notificationTypeId: dataNotificationModal?.typeId,
        notificationStatusId: this.notificationsService.getNotificationStatusByName(NOTIFICATION_CONSTANTS.INPROGRESS_STATUS).id
      }
      this.notificationsService.createNotification(dataNotificationService).subscribe(res => {
        this.notificationId = res.response.externalId;
      })

      const dialogRefMod = this.notificationDialog.open(NotificationComponent, {
        width: '540px',
        data: dataNotificationModal
      });

      dialogRefMod.afterClosed().subscribe(result => {
        if (result && result.confirmed && this.notificationId) {
          switch (result.action) {
            case this.ADD:
              let snackMessagesAdd: NotificationMessages = {
                completedTitleSnack: NOTIFICATION_CONSTANTS.ADD_CORPORATE_NAME_COMPLETE_TITLE,
                completedContentSnack: NOTIFICATION_CONSTANTS.ADD_CORPORATE_NAME_COMPLETE_CONTENT,
                errorTitleSnack: '',
                errorContentSnack: '',
                notificationId: this.notificationId,
                successCenterMessage: NOTIFICATION_CONSTANTS.ADD_CORPORATE_SUCCESS,
                errorCenterMessage: NOTIFICATION_CONSTANTS.ADD_GENERAL_ERROR,
                userId: userInfo.id
              }
              this.saveDataPost(snackMessagesAdd);
              this.closeModal()
              return;
            case this.EDIT:
              let snackMessagesEdit: NotificationMessages = {
                completedTitleSnack: NOTIFICATION_CONSTANTS.EDIT_CLIENT_COMPLETE_TITLE,
                completedContentSnack: NOTIFICATION_CONSTANTS.EDIT_CLIENT_COMPLETE_CONTENT,

                notificationId: this.notificationId,
                successCenterMessage: NOTIFICATION_CONSTANTS.EDIT_CORPORATE_SUCCESS,
                errorCenterMessage: NOTIFICATION_CONSTANTS.EDIT_GENERAL_ERROR,
                userId: userInfo.id
              }
              this.closeModal()
              this.saveDataPatch(snackMessagesEdit)

              return;
            case this.CANCEL:
              let editStatusData = {
                externalId: this.notificationId,
                status: this.notificationsService.getNotificationStatusByName(NOTIFICATION_CONSTANTS.COMPLETED_STATUS).id
              }
              this.notificationsService.updateNotification(editStatusData).subscribe(res => { })
              this.closeModal()
              return
          }
        } else {
          if (this.notificationId) {
            const editStatusData: EditNotificationStatus = {
              externalId: this.notificationId,
              status: this.notificationsService.getNotificationStatusByName(NOTIFICATION_CONSTANTS.CANCELED_STATUS).id
            }
            this.notificationsService.updateNotification(editStatusData).subscribe(res => { })
          }
        }
      });

    }

  }

  closeModal() {
    this.dialogRef.close(); // Cierra el modal
  }


  createNotificationError(notificationType: string, title?: string, description?: string, warn?: string) {
    const dataNotificationModal: notificationData | undefined = this.notificationDataService.uniqueError();
    dataNotificationModal!.title = title;
    dataNotificationModal!.content = description;
    dataNotificationModal!.warn = warn; // ESTOS PARAMETROS SE IGUALAN AQUI DEBIDO A QUE DEPENDEN DE LA RESPUESTA DEL ENDPOINT
    const encryptedData = localStorage.getItem('userInfo');
    if (encryptedData) {
      const userInfo = this.encryptionService.decryptData(encryptedData);
      let dataNotificationService: NotificationServiceData = { //INFORMACION NECESARIA PARA DAR DE ALTA UNA NOTIFICACION EN SISTEMA
        userId: userInfo.id,
        descripcion: description,
        notificationTypeId: dataNotificationModal?.typeId,
        notificationStatusId: this.notificationsService.getNotificationStatusByName(NOTIFICATION_CONSTANTS.COMPLETED_STATUS).id //EL STATUS ES COMPLETED DEBIDO A QUE EN UN ERROR NO ESPERAMOS UNA CONFIRMACION O CANCELACION(COMO PUEDE SER EN UN ADD, EDIT O DELETE)
      }
      this.notificationsService.createNotification(dataNotificationService).subscribe(res => {
      })
    }



    const dialogRef = this.notificationDialog.open(NotificationComponent, {
      width: '540px',
      data: dataNotificationModal
    });

  }

}
