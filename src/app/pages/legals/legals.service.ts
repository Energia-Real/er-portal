import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import * as entity from './legals.models';
import { GeneralResponse, NotificationMessages } from '@app/shared/models/general-models';
import { environment } from '@environment/environment';


@Injectable({
  providedIn: 'root'
})
export class LegalsService implements OnDestroy {
    private onDestroy$ = new Subject<void>();
    private API_URL_PERFORMANCE = environment.API_URL_PERFORMANCE;
    //private API_URL_PERFORMANCE ="https://localhost:7188/api/v1";


  constructor(
    private http: HttpClient,
  ) { }


   getQyas(): Observable<GeneralResponse<entity.QyAListResponse>> {
      const url = `${this.API_URL_PERFORMANCE}/qya/list`;
  
      return this.http
        .get<GeneralResponse<entity.QyAListResponse>>(url)    
      }

   getCats(): Observable<GeneralResponse<entity.CatsListResponse>> {
    const url = `${this.API_URL_PERFORMANCE}/qya/cats`;
    return this.http.get<GeneralResponse<entity.CatsListResponse>>(url)    
   }

  
  postDataQya(
      data: any,
      notificationMessages: NotificationMessages
    ) {
      const url = `${this.API_URL_PERFORMANCE}/qya/list`;
      const headers = new HttpHeaders({
        NotificationMessages: JSON.stringify(notificationMessages),
      });
  
      return this.http.post<any>(url, data, { headers });
    }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
