import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { LegalsService } from '../legals.service';
import { GeneralResponse } from '@app/shared/models/general-models';
import { CatQyA, QyAListResponse } from '../legals.models';
import { MatDialog } from '@angular/material/dialog';
import { notificationData } from '@app/shared/models/general-models';
import { NotificationDataService } from '@app/shared/services/notificationData.service';
import { EncryptionService } from '@app/shared/services/encryption.service';
import { NotificationService } from '@app/shared/services/notification.service';
import { NotificationServiceData } from '@app/shared/models/general-models';
import { NOTIFICATION_CONSTANTS } from '@app/core/constants/notification-constants';
import { NotificationComponent } from '@app/shared/components/notification/notification.component';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { TranslationService } from '@app/shared/services/i18n/translation.service';
import { Subject, takeUntil } from 'rxjs';


@Component({
  selector: 'app-qya',
  templateUrl: './qya.component.html',
  styleUrl: './qya.component.scss',
  encapsulation: ViewEncapsulation.None,
  standalone: false
})
export class QyaComponent implements OnInit {
  private onDestroy$ = new Subject<void>();

  constructor(
    private moduleServices: LegalsService,
    private dialog: MatDialog,
    private notificationDataService: NotificationDataService,
    private encryptionService: EncryptionService,
    private notificationsService: NotificationService,
    private router: Router,
    private location: Location,
    private translationService: TranslationService

  ) {
    this.translationService.currentLang$
    .pipe(takeUntil(this.onDestroy$))
    .subscribe(resp => {
      if(resp=="es-MX"){
        this.selectES()
      }
      else{
        this.selectEN()
      }
    });
  }
  ERROR = NOTIFICATION_CONSTANTS.ERROR_TYPE;
  QyAsEN!: CatQyA[];
  QyAsES!: CatQyA[];
  QyAsSelected!: CatQyA[];



  LenSel: "ES" | "EN" = "ES"

  ngOnInit(): void {
    this.fetchQyas()

  }

  fetchQyas() {
    this.moduleServices.getQyas().subscribe({
      next: (response: GeneralResponse<QyAListResponse>) => {
        this.QyAsES = response.response.cats.filter(cat => cat.lenguage == "ES");
        this.QyAsEN = response.response.cats.filter(cat => cat.lenguage == "EN");
        if (this.LenSel == 'ES')
          this.QyAsSelected = this.QyAsES
        else
          this.QyAsSelected = this.QyAsEN
        console.log(this.QyAsES)
      },
      error: (error) => {
        const errorArray = error?.error?.errors?.errors ?? [];
        if (errorArray.length) this.createNotificationError(this.ERROR, errorArray[0].title, errorArray[0].descripcion, errorArray[0].warn);
        console.error(error)
      }
    })
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

  selectES() {
    this.LenSel = "ES"
    this.QyAsSelected = this.QyAsES
  }

  selectEN() {
    this.LenSel = "EN"
    this.QyAsSelected = this.QyAsEN
  }

  return() {
    this.location.back();
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
