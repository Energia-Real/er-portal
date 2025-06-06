// token.interceptor.ts
import { Injectable, inject } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, switchMap, tap, throwError } from 'rxjs';
import { environment } from '@environment/environment';
import { AuthService } from '@app/auth/auth.service';
import { NotificationService } from '@app/shared/services/notification.service';
import { EditNotificationStatus, SnackData } from '../models/general-models';
import { NOTIFICATION_CONSTANTS } from '@app/core/constants/notification-constants';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmationSnackbarComponent } from '../components/confirmation-snackbar/confirmation-snackbar.component';
import { Store } from '@ngrx/store';
import { updateNotifications } from '@app/core/store/actions/notifications.actions';


@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(
    private notificationService: NotificationService,
    private snackBar: MatSnackBar,
    private store: Store
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const accountService = inject(AuthService);
    const notificationMessages = request.headers.get('NotificationMessages');
    
    // Get current language from localStorage directly to avoid circular dependency
    const currentLang = localStorage.getItem('selectedLanguage') || 'es-MX';
    
    if ( request.url.startsWith(environment.API_URL_FINANTIAL_MODEL) ||request.url.startsWith(environment.API_URL_PERFORMANCE) ||request.url.startsWith(environment.API_URL_DOMAIN_BACKEND) || request.url.startsWith("https://localhost:7188/")) {
      let notificationData:any=null;

      if (notificationMessages) notificationData = JSON.parse(notificationMessages);

      const user = accountService.userValue;
      
      const clonedRequest = user?.token
      ? request.clone({
          setHeaders: {
            Authorization: `Bearer ${user.token}`,
            AccessControlAllowOrigin: '*',
            'Accept-Language': currentLang
          }
        })
      : request.clone({
          setHeaders: {
            'Accept-Language': currentLang
          }
        });

      return next.handle(clonedRequest).pipe(
        tap((event) => {
          if (event instanceof HttpResponse && (event.status === 200 || event.status === 201) && notificationMessages) {
            
            // Mostrar solo el snackbar si solo contiene las propiedades del snackbar
            if (
              notificationData.completedTitleSnack &&
              notificationData.completedContentSnack &&
              !notificationData.notificationId &&
              !notificationData.successCenterMessage &&
              !notificationData.userId
            ) {
              let snackData: SnackData = {
                type: "COMPLETE",
                title: notificationData.completedTitleSnack,
                subtitle: notificationData.completedContentSnack
              };
              this.openCustomComponentSnackBar(snackData);
              return; // Salir de la función y no ejecutar el resto del código
            }
      
            // Si tiene todas las propiedades necesarias, continuar con la actualización
            if (
              notificationData.notificationId &&
              notificationData.successCenterMessage &&
              notificationData.userId
            ) {
              const editStatusData: EditNotificationStatus = {
                externalId: notificationData.notificationId,
                status: this.notificationService.getNotificationStatusByName(NOTIFICATION_CONSTANTS.COMPLETED_STATUS).id,
                centerTextId: this.notificationService.getNotificationCenterMessageByCode(notificationData.successCenterMessage).id
              };
      
              let snackData: SnackData = {
                type: "COMPLETE",
                title: notificationData.completedTitleSnack,
                subtitle: notificationData.completedContentSnack
              };
      
              this.openCustomComponentSnackBar(snackData);
      
              this.notificationService.updateNotification(editStatusData)
                .pipe(
                  switchMap(() =>
                    this.notificationService.updateNotificationsCenter(notificationData.userId)
                  )
                )
                .subscribe(notifications => {
                  this.store.dispatch(updateNotifications({ notifications }));
                });
            }
          }
        }),

      catchError((error: HttpErrorResponse) => {
        if (notificationData && notificationData.notificationId) {
          console.log(this.notificationService.getNotificationCenterMessageByCode(notificationData.errorCenterMessage));
          const editStatusData: EditNotificationStatus = {
            externalId: notificationData.notificationId,
            centerTextId: this.notificationService.getNotificationCenterMessageByCode(notificationData.errorCenterMessage).id,
            status: this.notificationService.getNotificationStatusByName(NOTIFICATION_CONSTANTS.FAILED_STATUS).id
          };

         
          this.notificationService.updateNotification(editStatusData)
            .pipe(
              switchMap(() => this.notificationService.updateNotificationsCenter(notificationData.userId))
            )
            .subscribe(notifications => {
              this.store.dispatch(updateNotifications({ notifications }));
            });
        }
        return throwError(error);
      })
    );
    }
    // For other requests, still add the Accept-Language header
    const clonedRequest = request.clone({
      setHeaders: {
        'Accept-Language': currentLang
      }
    });
    return next.handle(clonedRequest);
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
