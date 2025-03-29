import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NotificationMessages } from '@app/shared/models/general-models';
import { environment } from '@environment/environment';
import { Observable } from 'rxjs';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';

@Injectable({
  providedIn: 'root'
})
export class FinantialService {
  private finantialApiUrl = environment.API_URL_FINANTIAL_MODEL
  private socket$!: WebSocketSubject<any>;
  private socketUrl = environment.API_URL_FINANTIAL_MODEL_SOCKET+"dummy_run_scenarios"

  constructor(
      private http: HttpClient,
  ) { 
    this.socket$ = webSocket(this.socketUrl);
    
  }

  postCsv(
        data: File,
        notificationMessages: NotificationMessages
      ) {
        const url = `${this.finantialApiUrl}csv/dummy`;
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
    

  /* getTemplate(): Observable<F> {
      const url = `${environment.API_URL_PERFORMANCE}/energy-performance/sites`;
  
      return this.http.post<entity.DataTablePlantsResponse>(url, filters).pipe(
        map((response) => Mapper.getDataClientsMapper(response, this.formatsService))
      );
    } */

}
