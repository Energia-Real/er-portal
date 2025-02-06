import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import{NotificationServiceData,EditNotificationStatus, GeneralResponse, NotificationsResponse,Notification}from '@app/shared/models/general-models';
import { environment } from '@environment/environment';

import { map, Observable, tap } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private API_URL_PERFORMANCE = environment.API_URL_PERFORMANCE;
  private notificationStatuses: any;
  private notificationTypes: any;
  private notificationCenterMessages: any;
  private notifications: Notification[] = [];

  private isLoadedStatus = false;
  private isLoadedTypes = false;
  private isLoadedCenterMessages = false;

  constructor(private http: HttpClient) {}

  createNotification(data: NotificationServiceData): Observable<any> {
    const url = `${this.API_URL_PERFORMANCE}/notification`;
    return this.http.post<any>(url, data);
  }

  updateNotification(data: EditNotificationStatus): Observable<any> {
    const url = `${this.API_URL_PERFORMANCE}/notification`;
    return this.http.put<any>(url, data);
  }

  loadNotificationStatuses(): Observable<any> {
    if (this.isLoadedStatus) {
      return new Observable((observer) => {
        observer.next(this.notificationStatuses);
        observer.complete();
      });
    } else {
      const url = `${this.API_URL_PERFORMANCE}/notification/status`;
      return this.http.get<any>(url).pipe(
        tap((data) => {
          this.notificationStatuses = data.response.notificationStatusResponse;
          this.isLoadedStatus = true;
        })
      );
    }
  }

  loadNotificationTypes(): Observable<any> {
    if (this.isLoadedTypes) {
      return new Observable((observer) => {
        observer.next(this.notificationTypes);
        observer.complete();
      });
    } else {
      const url = `${this.API_URL_PERFORMANCE}/notification/types`;
      return this.http.get<any>(url).pipe(
        tap((data) => {
          this.notificationTypes = data.response.notificationTypesResponse;
          this.isLoadedTypes = true;
        })
      );
    }
  }

  loadNotificationCenterMessages(): Observable<any> {
    if (this.isLoadedCenterMessages) {
      return new Observable((observer) => {
        observer.next(this.notificationCenterMessages);
        observer.complete();
      });
    } else {
      const url = `${this.API_URL_PERFORMANCE}/notification/centerTexts`;
      return this.http.get<any>(url).pipe(
        tap((data) => {
          this.notificationCenterMessages =
            data.response.notificationCenterTextResponse;
          this.isLoadedCenterMessages = true;
        })
      );
    }
  }

  updateNotificationsCenter(userId: string): Observable<Notification[]> {
    const url = `${this.API_URL_PERFORMANCE}/notification/${userId}/historial`;
    return this.http
      .get<{ response: { notificationsResponse: Notification[] } }>(url)
      .pipe(
        tap((data) => {
          this.notifications = data.response.notificationsResponse;
        }),
        map((data) => data.response.notificationsResponse)
      );
  }

  getNotificationStatusByName(statusName: string): any | undefined {
    return this.notificationStatuses.find(
      (status: { nombreEstatus: string }) => status.nombreEstatus === statusName
    );
  }

  getNotificationStatusById(statusNameId: number): any | undefined {
    return this.notificationStatuses.find(
      (status: { id: number }) => status.id === statusNameId
    );
  }

  getNotificationTypesByName(statusType: string): any | undefined {
    console.log(this.notificationTypes);
    return this.notificationTypes.find(
      (type: { nombreTipo: string }) => type.nombreTipo === statusType
    );
  }

  getNotificationTypesById(statusTypeId: number): any | undefined {
    return this.notificationTypes.find(
      (type: { id: number }) => type.id === statusTypeId
    );
  }

  getNotificationCenterMessageByCode(code: string): any | undefined {
    return this.notificationCenterMessages.find(
      (centerMessage: { textKey: string }) => centerMessage.textKey === code
    );
  }

  getNotificationCenterMessageById(id: number): any | undefined {
    return this.notificationCenterMessages.find(
      (centerMessage: { id: number }) => centerMessage.id === id
    );
  }

  getNotifications(): any | undefined {
    return this.notifications;
  }
}
