import { ChangeDetectorRef, Component, Inject, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { NOTIFICATION_CONSTANTS } from '@app/core/constants/notification-constants';
import { notificationData } from '@app/shared/models/general-models';

@Component({
    selector: 'app-notification',
    templateUrl: './notification.component.html',
    styleUrl: './notification.component.scss',
    standalone: false
})
export class NotificationComponent implements OnDestroy {
  private onDestroy$ = new Subject<void>();
  ADD = NOTIFICATION_CONSTANTS.ADD_CONFIRM_TYPE;
  CANCEL = NOTIFICATION_CONSTANTS.CANCEL_TYPE;
  EDIT = NOTIFICATION_CONSTANTS.EDIT_CONFIRM_TYPE;
  DELETE = NOTIFICATION_CONSTANTS.DELETE_CONFIRM_TYPE;
  ERRORS = NOTIFICATION_CONSTANTS.ERRORS; // DEBE VERIFICARSE LA IMPLEMENTACVION DE MULTIPLES ERRORES Y LAS CONSTANTES
  //EN VEZ DE LLAMARSE ERRORS PODRIA SER MULTIPLE_ERRORS_TYPE, UN POCO MAS DESCRIPTIVO 
  ERROR = NOTIFICATION_CONSTANTS.ERROR_TYPE; 
  constructor(
    public dialogRef: MatDialogRef<NotificationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: notificationData,
    private cdr: ChangeDetectorRef,
  ) {

    setTimeout(() => {
      this.cdr.detectChanges(); // Fuerza la actualización del HTML
    }, 0); 
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  sendEventToParent(type: string, confirm: boolean): void {
    const eventData = { confirmed: confirm, action: type };
    this.dialogRef.close(eventData);
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.unsubscribe();
  }
}

