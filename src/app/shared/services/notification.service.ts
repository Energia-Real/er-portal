import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import{NotificationServiceData,EditNotificationStatus}from '@app/shared/models/general-models';
import { environment } from '@environment/environment';

import { Observable, tap } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class NotificationService {
	private API_URL_NOTIFICATIONS = environment.API_URL_NOTIFICATIONS;
  private notificationStatuses: any;
  private notificationTypes: any;
  private isLoadedStatus = false;
  private isLoadedTypes = false;


  constructor(private http: HttpClient) { }

  createNotification(data: NotificationServiceData): Observable<any> {
    const url = `${this.API_URL_NOTIFICATIONS}/notification`;
    return this.http.post<any>(url, data);  
  }

  updateNotificationStatus(data:EditNotificationStatus):Observable<any> {
    const url = `${this.API_URL_NOTIFICATIONS}/notification`;
    return this.http.put<any>(url, data);  
  }

  loadNotificationStatuses(): Observable<any> {
    if (this.isLoadedStatus) {
      return new Observable((observer) => {
        observer.next(this.notificationStatuses);
        observer.complete();
      });
    } else {
      const url = `${this.API_URL_NOTIFICATIONS}/notification/status`;
      return this.http.get<any>(url)
        .pipe(
          tap(data => {
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
      const url = `${this.API_URL_NOTIFICATIONS}/notification/types`;
      return this.http.get<any>(url)
        .pipe(
          tap(data => {
            this.notificationTypes = data.response.notificationTypesResponse;
            this.isLoadedStatus = true; 
          })
        );
    }
  }

  getNotificationStatusByName(nombreEstatus: string): any | undefined {
    return this.notificationStatuses.find((status: { nombreEstatus: string; }) => status.nombreEstatus === nombreEstatus);
  }

  getNotificationTypesByName(nombreTipo: string): any | undefined {
    return this.notificationTypes.find((status: { nombreTipo: string; }) => status.nombreTipo === nombreTipo);
  }

}
