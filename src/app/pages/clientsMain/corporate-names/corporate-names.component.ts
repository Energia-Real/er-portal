import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { selectClientName, selectCorporateClient } from '@app/core/store/selectors/drawer.selector';
import { Store } from '@ngrx/store';
import { Subject, Subscription } from 'rxjs';
import { ClientsService } from '../clients.service';
import { corporate, DataCorporateResponse, PlantWhitoutCorporate } from '../clients-model';
import { NOTIFICATION_CONSTANTS } from '@app/core/constants/notification-constants';
import { notificationData, NotificationServiceData } from '@app/shared/models/general-models';
import { NotificationService } from '@app/shared/services/notification.service';
import { NotificationDataService } from '@app/shared/services/notificationData.service';
import { EncryptionService } from '@app/shared/services/encryption.service';
import { MatDialog } from '@angular/material/dialog';
import { NotificationComponent } from '@app/shared/components/notification/notification.component';
import { EditCorporateNameComponent } from '../edit-corporate-name/edit-corporate-name.component';

@Component({
  selector: 'app-corporate-names',
  templateUrl: './corporate-names.component.html',
  styleUrl: './corporate-names.component.scss'
})
export class CorporateNamesComponent implements OnInit, OnDestroy {
  @Input() isOpen = false;
  @Input() clientId: string | null = null;

  @Output() closeDrawerEmmit = new EventEmitter<boolean>();
  private onDestroy$ = new Subject<void>();
  private notificationId?: string;


  ADD = NOTIFICATION_CONSTANTS.ADD_CONFIRM_TYPE;
  CANCEL = NOTIFICATION_CONSTANTS.CANCEL_TYPE;
  EDIT = NOTIFICATION_CONSTANTS.EDIT_CONFIRM_TYPE;
  DELETE = NOTIFICATION_CONSTANTS.DELETE;
  ERROR = NOTIFICATION_CONSTANTS.ERROR_TYPE;

  drawerClientSub: Subscription;
  clientNameSub: Subscription;
  corporateData!: DataCorporateResponse;
  clientName!: string;

  plants: PlantWhitoutCorporate[] = [
  ]

  plantsFijo: PlantWhitoutCorporate[] = [
  ]

  constructor(
    private store: Store,
    private moduleServices: ClientsService,
    private notificationsService: NotificationService,
    private notificationDataService: NotificationDataService,
    private encryptionService: EncryptionService,
    private dialog: MatDialog,
    public editDialog: MatDialog,
  ) {
    this.drawerClientSub = this.store.select(selectCorporateClient).subscribe(resp => {
      this.getCorporateData(resp!)
    })

    this.clientNameSub = this.store.select(selectClientName).subscribe(resp => {
      this.clientName = resp!
    })
  }

  ngOnInit() {
  }

  closeDrawer() {
    this.isOpen = false;
    this.closeDrawerEmmit.emit(false)
  }

  changeEditMode(razonSocial: corporate | null) {
    const editDialog = this.dialog.open(EditCorporateNameComponent, {
      width: '564px',
      height: '550px',
      data: {
        razonSocial: razonSocial,
        clientId: this.clientId
      },
    });
    editDialog.afterClosed().subscribe(() => {
      this.getCorporateData(this.clientId!)
    });
  }


  getCorporateData(clientId: string) {
    if (clientId != null) {
      this.clientId = clientId;
      this.moduleServices.getCorporates(clientId).subscribe({
        next: (resp) => {
          this.corporateData = resp.response
        },
        error: (error) => {
          let errorArray = error.error.errors.errors;
          if (errorArray.length == 1) {
            this.createNotificationError(this.ERROR, errorArray[0].title, errorArray[0].descripcion, errorArray[0].warn)
          }
        }
      })
    }

  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.unsubscribe();
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

    this.dialog.open(NotificationComponent, {
      width: '540px',
      data: dataNotificationModal
    });
  }
}
