import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GeneralFilters, notificationData } from '@app/shared/models/general-models';
import { NOTIFICATION_CONSTANTS } from '@app/core/constants/notification-constants';
import { NotificationComponent } from '@app/shared/components/notification/notification.component';
import { NotificationService } from './notification.service';
import { FormatsService } from './formats.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationDataService {


  ADD = NOTIFICATION_CONSTANTS.ADD_CONFIRM_TYPE;
  CANCEL = NOTIFICATION_CONSTANTS.CANCEL_TYPE;
  EDIT = NOTIFICATION_CONSTANTS.EDIT_CONFIRM_TYPE;
  DELETE = NOTIFICATION_CONSTANTS.DELETE;
  ERROR = NOTIFICATION_CONSTANTS.ERROR_TYPE;
  constructor(
    private notificationService: NotificationService,
    private formatsService: FormatsService
  ) { }


  clientsNotificationData(notificationType: string): notificationData | undefined {
    var dataNotification: notificationData;

    switch (notificationType) {
      case this.ADD:
        dataNotification = {
          type: NOTIFICATION_CONSTANTS.ADD_CONFIRM_TYPE,
          typeId: this.notificationService.getNotificationTypesByName(this.ADD).id,
          title: NOTIFICATION_CONSTANTS.ADD_CLIENT_TITLE,
          content: NOTIFICATION_CONSTANTS.ADD_CLIENT_CONTENT,
          warn: NOTIFICATION_CONSTANTS.ADD_CLIENT_WARN,
          buttonAction: NOTIFICATION_CONSTANTS.ACTION_BUTTON
        }
        return dataNotification;
      case this.EDIT:
        dataNotification = {
          type: NOTIFICATION_CONSTANTS.EDIT_CONFIRM_TYPE,
          typeId: this.notificationService.getNotificationTypesByName(this.EDIT).id,
          title: NOTIFICATION_CONSTANTS.GLOBAL_EDIT_TITLE,
          content: NOTIFICATION_CONSTANTS.GLOBAL_EDIT_CONTENT,
          warn: NOTIFICATION_CONSTANTS.GLOBAL_EDIT_WARN,
          buttonAction: NOTIFICATION_CONSTANTS.ACTION_BUTTON
        }
        return dataNotification;
      case this.CANCEL:
        dataNotification = {
          type: NOTIFICATION_CONSTANTS.CANCEL_TYPE,
          typeId: this.notificationService.getNotificationTypesByName(this.CANCEL).id,
          title: NOTIFICATION_CONSTANTS.CANCEL_ADD_CLIENT_TITLE,
          content: NOTIFICATION_CONSTANTS.CANCEL_ADD_CLIENT_CONTENT,
          buttonAction: NOTIFICATION_CONSTANTS.ACTION_BUTTON
        }
        return dataNotification;
      default:
        return
    }

  }

  corporateNotificationData(notificationType: string): notificationData | undefined{
    var dataNotification: notificationData;
    switch (notificationType) {
      case this.ADD:
        dataNotification = {
          type: NOTIFICATION_CONSTANTS.ADD_CONFIRM_TYPE,
          typeId: this.notificationService.getNotificationTypesByName(this.ADD).id,
          title: NOTIFICATION_CONSTANTS.ADD_CORPORATE_NAME_TITLE,
          content: NOTIFICATION_CONSTANTS.ADD_CORPORATE_NAME_CONTENT,
          warn: NOTIFICATION_CONSTANTS.ADD_CORPORATE_NAME_WARN,
          buttonAction: NOTIFICATION_CONSTANTS.ACTION_BUTTON
        }
        return dataNotification;
      case this.EDIT:
        dataNotification = {
          type: NOTIFICATION_CONSTANTS.EDIT_CONFIRM_TYPE,
          typeId: this.notificationService.getNotificationTypesByName(this.EDIT).id,
          title: NOTIFICATION_CONSTANTS.GLOBAL_EDIT_TITLE,
          content: NOTIFICATION_CONSTANTS.GLOBAL_EDIT_CONTENT,
          warn: NOTIFICATION_CONSTANTS.GLOBAL_EDIT_WARN,
          buttonAction: NOTIFICATION_CONSTANTS.ACTION_BUTTON
        }
        return dataNotification;
      case this.CANCEL:
        dataNotification = {
          type: NOTIFICATION_CONSTANTS.CANCEL_TYPE,
          typeId: this.notificationService.getNotificationTypesByName(this.CANCEL).id,
          title: NOTIFICATION_CONSTANTS.CANCEL_ADD_CORPORATE_NAME_TITLE,
          content: NOTIFICATION_CONSTANTS.CANCEL_ADD_CORPORATE_NAME_CONTENT,
          buttonAction: NOTIFICATION_CONSTANTS.ACTION_BUTTON
        }
        return dataNotification;
      default:
        return
    }
  }

  invoicesNotificationData(notificationType: boolean, data?: GeneralFilters): notificationData | undefined {
    var dataNotification: notificationData;

    if (notificationType) {
      dataNotification = {
        type: NOTIFICATION_CONSTANTS.ADD_CONFIRM_TYPE,
        title: NOTIFICATION_CONSTANTS.GENERATE_INVOICE_TITLE,
        subtitle: `${this.formatsService.dateFormatWithoutDay(data?.startDate)} - ${this.formatsService.dateFormatWithoutDay(data?.endDate!)}`,
        content: NOTIFICATION_CONSTANTS.GENERATE_INVOICE_CONTENT,
        warn: NOTIFICATION_CONSTANTS.GENERATE_INVOICE_WARN,
        buttonAction: NOTIFICATION_CONSTANTS.ACTION_BUTTON
      }
      return dataNotification;
      
    } else {
      dataNotification = {
        type: NOTIFICATION_CONSTANTS.ADD_CONFIRM_TYPE,
        title: NOTIFICATION_CONSTANTS.CONFIRM_INVOICE_TITLE,
        content: NOTIFICATION_CONSTANTS.CONFIRM_INVOICE_CONTENT,
        warn: NOTIFICATION_CONSTANTS.CONFIRM_INVOICE_WARN,
        buttonAction: NOTIFICATION_CONSTANTS.ACTION_BUTTON
      }
      return dataNotification;
    }
  }

  errors(errors: any) {
    const dataNotification = {
      type: NOTIFICATION_CONSTANTS.ERRORS,
      title: errors?.length > 1 ? NOTIFICATION_CONSTANTS.ERRORS_INVOICE_TITLE : NOTIFICATION_CONSTANTS.ERROR_INVOICE_TITLE,
      content: errors?.length > 1 ? NOTIFICATION_CONSTANTS.ERRORS_INVOICE_CONTENT : NOTIFICATION_CONSTANTS.ERROR_INVOICE_CONTENT,
      errors: errors,
    }
    return dataNotification;
  }

  uniqueError(): notificationData{// funcion que regresa paramertros(en este caso solo nos sirve el id) para crear una notificacion de error en sistema
    const dataNotification = {
      type: NOTIFICATION_CONSTANTS.ERROR_TYPE,
      typeId: this.notificationService.getNotificationTypesByName(this.ERROR).id,  
      //LOS DEMAS PARAMETROS COMO TITLE, DESCRIPTIOPN Y WARN NO SE DEFINEN AQUI YA QUE DEPENDE DE LA RESPUESTA DEL ENDPOINT(CADA ENDPOINT DA MENSAJES DIFERENTES DE ERROR)
    }
    return dataNotification;
  }
}
