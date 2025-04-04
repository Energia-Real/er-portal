import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { NotificationMessages } from '@app/shared/models/general-models';
import { environment } from '@environment/environment';
import { Observable, Subject } from 'rxjs';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';

@Injectable({
  providedIn: 'root'
})
export class FinantialService implements OnDestroy {
  private onDestroy$ = new Subject<void>();
  private finantialApiUrl = environment.API_URL_FINANTIAL_MODEL
  private socket$!: WebSocketSubject<any>;
  private socketUrl = environment.API_URL_FINANTIAL_MODEL_SOCKET + "run_scenarios"

  constructor(
    private http: HttpClient,
  ) {
    this.socket$ = webSocket(this.socketUrl);

  }

  postCsv(
    data: File,
    notificationMessages: NotificationMessages
  ) {
    const url = `${this.finantialApiUrl}csv`;
    const headers = new HttpHeaders({
      NotificationMessages: JSON.stringify(notificationMessages),
    });
    const formData = new FormData();
    formData.append('file', data);

    return this.http.post<any>(url, formData, { headers });
  }

  sendMessage(action: string, id: string) {
    this.socket$.next({ action, id });
  }

  getMessages(): Observable<any> {
    return this.socket$.asObservable();
  }

  closeConnection() {
    this.socket$.complete();
  }


  downloadTemplate(): Observable<Blob> {
    const url = `${this.finantialApiUrl}template`;
    return this.http.get(url, {
      responseType: 'blob',
    });
  }

  exportInformation(
    uuid: string,
    notificationMessages: NotificationMessages
  ): Observable<Blob> {
    const url = `${this.finantialApiUrl}output/${uuid}`;
    const headers = new HttpHeaders({
      NotificationMessages: JSON.stringify(notificationMessages),
    });
    return this.http.get(url, {
      headers: headers,
      responseType: 'blob',
    });
  }

  deleteFile(
    uuid: string,
    notificationMessages: NotificationMessages
  ) {
    const url = `${this.finantialApiUrl}clear-scenarios/${uuid}`;
    const headers = new HttpHeaders({
      NotificationMessages: JSON.stringify(notificationMessages),
    });
    return this.http.delete<any>(url, { headers });
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

}
