import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import{Notification}from '@app/shared/models/general-models';
import { NotificationService } from '@app/shared/services/notification.service';
import { NOTIFICATION_CONSTANTS } from '@app/core/constants/notification-constants';
import { animate, style, transition, trigger } from '@angular/animations';
import { combineLatest, Subscription } from 'rxjs';


@Component({
  selector: 'app-notification-card-center',
  templateUrl: './notification-card-center.component.html',
  styleUrl: './notification-card-center.component.scss',
  animations: [
    trigger('fadeOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.9)' }),
        animate('300ms ease-in', style({ opacity: 1, transform: 'scale(1)' }))
      ]),
      transition(':leave', [
        animate('300ms ease-out', style({ opacity: 0, transform: 'scale(0.9)' }))
      ])
    ])
  ]
})
export class NotificationCardCenterComponent implements OnChanges {
  @Input() notification!:Notification;
  @Output() notificationDeleted = new EventEmitter<void>();

  messages:any=null;
  type!:any;
  stauts!:any;
  isRendered = false;

  ADD=NOTIFICATION_CONSTANTS.ADD_CONFIRM_TYPE;
  EDIT=NOTIFICATION_CONSTANTS.EDIT_CONFIRM_TYPE;
  DELETE=NOTIFICATION_CONSTANTS.DELETE;


  COMPLETED= NOTIFICATION_CONSTANTS.COMPLETED_STATUS; 
  FAILED = NOTIFICATION_CONSTANTS.FAILED_STATUS; 

  private subscription!: Subscription;


  constructor(
    private  notificationService: NotificationService,
    private cdr: ChangeDetectorRef
  ){
   

  }
 
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['notification'] && this.notification) {
      this.subscription = combineLatest([
        this.notificationService.loadNotificationCenterMessages(),
        this.notificationService.loadNotificationTypes(),
        this.notificationService.loadNotificationStatuses(),
      ]).subscribe(([messagesResponse, typesResponse, statusesResponse]) => {
        this.messages = messagesResponse.find(
          (centerMessage: { id: number }) => centerMessage.id === this.notification.notificationCenterTextId
        );
        this.type = typesResponse.find(
          (type: { id: number }) => type.id === this.notification.notificationTypeId
        );
        this.stauts = statusesResponse.find(
          (status: { id: number }) => status.id === this.notification.notificationStatusId
        );
        if (this.messages && this.type && this.stauts && !this.isRendered) {
          this.isRendered = true;
          this.cdr.detectChanges();
        }
      });
    }
  }

  deleteNotification(){
    console.log("deleteNotification")
    this.notificationDeleted.emit();
  }

  
}
