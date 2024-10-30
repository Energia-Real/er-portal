import { Component, Inject, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { NOTIFICATION_CONSTANTS } from '@app/core/constants/notification-constants';
import { notificationData } from '@app/shared/models/general-models';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.scss'
})
export class NotificationComponent implements OnDestroy {
  private onDestroy$ = new Subject<void>();
  ADD=NOTIFICATION_CONSTANTS.ADD;
  CANCEL=NOTIFICATION_CONSTANTS.CANCEL;
  EDIT=NOTIFICATION_CONSTANTS.EDIT;
  DELETE=NOTIFICATION_CONSTANTS.DELETE;


  constructor(
    public dialogRef: MatDialogRef<NotificationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: notificationData
  ) 
  {
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  sendEventToParent(type:string): void {
    const eventData = { confirmed: true, action: type }; 
    this.dialogRef.close(eventData);
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.unsubscribe();
  }
}

