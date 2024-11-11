// token.interceptor.ts
import { Injectable, inject } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { environment } from '@environment/environment';
import { AuthService } from '@app/auth/auth.service';
import { NotificationService } from '@app/shared/services/notification.service';
import { EditNotificationStatus, SnackData } from '../models/general-models';
import { NOTIFICATION_CONSTANTS } from '@app/core/constants/notification-constants';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmationSnackbarComponent } from '../components/confirmation-snackbar/confirmation-snackbar.component';


@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(
    private notificationService: NotificationService,
    private snackBar: MatSnackBar
  ){
    
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const accountService = inject(AuthService);
    const notificationMessages = request.headers.get('NotificationMessages');
    if (
      request.url.startsWith(environment.API_URL_CLIENTS_V1) 
      || request.url.startsWith(environment.API_URL_EQUIPMENTS_V1) 
      || request.url.startsWith(environment.API_URL_BATU_V1) 
      || request.url.startsWith(environment.API_URL_EQUIPMENT_HUAWEI_V1)  
      || request.url.startsWith(environment.API_URL_ENERGY_PERFORMANCE_V1) 
      || request.url.startsWith(environment.API_URL_BILL_V1)  
      || request.url.startsWith(environment.API_URL_NOTIFICATIONS)
    ) {
      let notificationData:any=null;

      if (notificationMessages) {
        notificationData = JSON.parse(notificationMessages);  
      }
  
      
      const user = accountService.userValue;
  
      const clonedRequest = user?.token
      ? request.clone({
          setHeaders: {
            Authorization: `Bearer ${user.token}`,
            AccessControlAllowOrigin: '*'
          }
        })
      : request;

      return next.handle(clonedRequest).pipe(
      tap((event) => {
        if (event instanceof HttpResponse && (event.status === 200 || event.status === 201) && notificationMessages) {
          const editStatusData:EditNotificationStatus={
            externalId: notificationData.notificationId,
            status: this.notificationService.getNotificationStatusByName(NOTIFICATION_CONSTANTS.COMPLETED_STATUS).id
          }
          let snackData:SnackData={
            type:"COMPLETE",
            title:notificationData.completedTitle,
            subtitle:notificationData.completedContent
          }
          this.openCustomComponentSnackBar(snackData);
          this.notificationService.updateNotificationStatus(editStatusData).subscribe()        
        }
      }),
      catchError((error: HttpErrorResponse) => {
        if (notificationData.notificationId) {
          const editStatusData:EditNotificationStatus={
            externalId: notificationData.notificationId,
            status: this.notificationService.getNotificationStatusByName(NOTIFICATION_CONSTANTS.FAILED_STATUS).id
          }
          this.notificationService.updateNotificationStatus(editStatusData).subscribe() 
        }
        return throwError(error);
      })
    );
      

    }
    return next.handle(request);
  }

  openCustomComponentSnackBar(data:SnackData) {
    this.snackBar.openFromComponent(ConfirmationSnackbarComponent, {
      data: data,
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: ['custom-snackbar']
    });
  }

}
