import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import{Notification}from '@app/shared/models/general-models';
import { NotificationService } from '@app/shared/services/notification.service';
import { NOTIFICATION_CONSTANTS } from '@app/core/constants/notification-constants';


@Component({
  selector: 'app-notification-card-center',
  templateUrl: './notification-card-center.component.html',
  styleUrl: './notification-card-center.component.scss'
})
export class NotificationCardCenterComponent implements OnChanges {
  @Input() notification!:Notification;
  messages!:any;
  type!:any;
  stauts!:any;

  ADD=NOTIFICATION_CONSTANTS.ADD_CONFIRM_TYPE;
  EDIT=NOTIFICATION_CONSTANTS.EDIT_CONFIRM_TYPE;
  DELETE=NOTIFICATION_CONSTANTS.DELETE;


  COMPLETED= NOTIFICATION_CONSTANTS.COMPLETED_STATUS; 
  FAILED = NOTIFICATION_CONSTANTS.FAILED_STATUS; 

  constructor(
    private  notificationService: NotificationService
  ){
   

  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['notification'] && changes['notification'].currentValue) {
      this.messages = this.notificationService.getNotificationCenterMessageById(
        this.notification.notificationCenterTextId
      );
      this.type=this.notificationService.getNotificationTypesById(this.notification.notificationTypeId);
      this.stauts=this.notificationService.getNotificationStatusById(this.notification.notificationStatusId);
    }
  }

  
}
