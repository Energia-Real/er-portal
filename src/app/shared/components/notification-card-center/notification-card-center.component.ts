import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import{Notification}from '@app/shared/models/general-models';
import { NotificationService } from '@app/shared/services/notification.service';
import { NOTIFICATION_CONSTANTS } from '@app/core/constants/notification-constants';
import { animate, style, transition, trigger } from '@angular/animations';


@Component({
  selector: 'app-notification-card-center',
  templateUrl: './notification-card-center.component.html',
  styleUrl: './notification-card-center.component.scss',
  animations: [
    trigger('fadeOut', [
      transition(':leave', [
        style({ opacity: 1, transform: 'scale(1)' }),
        animate('300ms ease-out', style({ opacity: 0, transform: 'scale(0.9)' }))
      ])
    ])
  ]
})
export class NotificationCardCenterComponent implements OnChanges {
  @Input() notification!:Notification;
  @Output() notificationDeleted = new EventEmitter<void>();

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

  deleteNotification(){
    console.log("deleteNotification")
    this.notificationDeleted.emit();
  }

  
}
