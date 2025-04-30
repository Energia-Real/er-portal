import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FinantialStepperComponent } from '../finantial-stepper/finantial-stepper.component';
import { FinantialDataModelStepper } from '../finantial-model-model';
import { FinantialService } from '../finantial.service';
import { NOTIFICATION_CONSTANTS } from '@app/core/constants/notification-constants';
import { EditNotificationStatus, notificationData, NotificationMessages, NotificationServiceData } from '@app/shared/models/general-models';
import { NotificationDataService } from '@app/shared/services/notificationData.service';
import { EncryptionService } from '@app/shared/services/encryption.service';
import { NotificationService } from '@app/shared/services/notification.service';
import { NotificationComponent } from '@app/shared/components/notification/notification.component';
import { Subject } from 'rxjs';
import { Tabulator } from 'tabulator-tables';




@Component({
  selector: 'app-finantial-model-layout',
  templateUrl: './finantial-model-layout.component.html',
  styleUrl: './finantial-model-layout.component.scss'
})
export class FinantialModelLayoutComponent implements OnInit, OnDestroy,AfterViewInit {

  exTable: any;
  filterParam: string = '';


  private onDestroy$ = new Subject<void>();
  @ViewChild('fileInput') fileInput!: ElementRef;
  selectedFile: File | null = null;
  processStatus: string | null = null;
  scenarios: number | null = null;
  fileId: string | null = null;
  private notificationId?: string;

  ADD = NOTIFICATION_CONSTANTS.ADD_CONFIRM_TYPE;
  CANCEL = NOTIFICATION_CONSTANTS.CANCEL_TYPE;
  EDIT = NOTIFICATION_CONSTANTS.EDIT_CONFIRM_TYPE;
  DELETE = NOTIFICATION_CONSTANTS.DELETE_CONFIRM_TYPE;
  ERROR = NOTIFICATION_CONSTANTS.ERROR_TYPE;

  constructor(
    public dialog: MatDialog,
    private moduleService: FinantialService,
    private notificationDataService: NotificationDataService,
    private encryptionService: EncryptionService,
    private notificationsService: NotificationService,
    public notificationDialog: MatDialog,
  ) {

  }

  ngOnInit(): void {

   

  }
  ngAfterViewInit() {
  }

  openFileSelector() {
    this.fileInput.nativeElement.value = '';
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: Event) {
    this.selectedFile = null;
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
    if (this.selectedFile != null) {
      this.openValidation()

    }
    input.value = '';
  }

  openValidation() {
    let dataModal: FinantialDataModelStepper = { file: this.selectedFile };
    this.scenarios = null;
    this.processStatus = null;
    this.fileId = null;
    const dialogRef = this.dialog.open(FinantialStepperComponent, {
      disableClose: true,
      width: '753px',
      data: dataModal!
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.status) {
        this.processStatus = result.status
      }
      if (result.scenarios) {
        this.scenarios = result.scenarios
      }
      if (result.fileId) {
        this.fileId = result.fileId
      }
      this.selectedFile = null;
    });
  }

  donwloadTemplate() {
    this.moduleService.downloadTemplate().subscribe({
      next: (resp: Blob) => {
        const url = window.URL.createObjectURL(resp);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'FinantialModelTemplate.csv';
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
      },
      error: (err) => {
      }
    })
  }

  getInformation() {
    let snackMessagesAdd: NotificationMessages = {
      completedTitleSnack: NOTIFICATION_CONSTANTS.CONFIRM_DOWNLOAD_FILE_TITLE,
      completedContentSnack: NOTIFICATION_CONSTANTS.CONFIRM_DOWNLOAD_FILE_CONTENT,
    }
    this.moduleService.exportInformation(this.fileId!, snackMessagesAdd).subscribe({
      next: (excel: Blob) => {
        const url = window.URL.createObjectURL(excel);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'FinantialModel.xlsx';
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
      },
      error: (err) => {
      }
    })
  }

  deleteScenarios(notificationData: NotificationMessages) {
    this.moduleService.deleteFile(this.fileId!, notificationData).subscribe({
      next: (resp: any) => {
        this.selectedFile = null;
        this.scenarios = null;
        this.processStatus = null;
        this.fileId = null;
      },
      error: (err) => {
      }
    })
  }

  createNotificationModal(notificationType: string) {
    const encryptedData = localStorage.getItem('userInfo');
    if (encryptedData) {
      const userInfo = this.encryptionService.decryptData(encryptedData);
      const dataNotificationModal: notificationData | undefined = this.notificationDataService.finantialNotificationData(notificationType);
      const dataNotificationService: NotificationServiceData = {
        userId: userInfo.id,
        descripcion: dataNotificationModal?.title,
        notificationTypeId: dataNotificationModal?.typeId,
        notificationStatusId: this.notificationsService.getNotificationStatusByName(NOTIFICATION_CONSTANTS.INPROGRESS_STATUS).id
      }
      this.notificationsService.createNotification(dataNotificationService).subscribe(res => {
        this.notificationId = res.response.externalId;
      })

      const dialogRef = this.notificationDialog.open(NotificationComponent, {
        width: '540px',
        data: dataNotificationModal
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result && result.confirmed && this.notificationId) {
          switch (result.action) {
            case this.DELETE:
              let snackMessagesAdd: NotificationMessages = {
                completedTitleSnack: NOTIFICATION_CONSTANTS.CONFIRM_DELETE_FINANTIAL_TITLE,
                completedContentSnack: NOTIFICATION_CONSTANTS.CONFIRM_DELETE_FINANTIAL_CONTENT,
                notificationId: this.notificationId,
                successCenterMessage: NOTIFICATION_CONSTANTS.DELETE_FINANTIAL_SUCCESS,
                errorCenterMessage: NOTIFICATION_CONSTANTS.DELETE_FINANTIAL_ERROR,
                userId: userInfo.id
              }
              this.deleteScenarios(snackMessagesAdd);
              return;
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


  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }


}
