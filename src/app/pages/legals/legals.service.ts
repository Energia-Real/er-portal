import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import * as entity from './legals.models';
import { GeneralResponse } from '@app/shared/models/general-models';
import { environment } from '@environment/environment';


@Injectable({
  providedIn: 'root'
})
export class LegalsService implements OnDestroy {
    private onDestroy$ = new Subject<void>();
    private API_URL_PERFORMANCE = environment.API_URL_PERFORMANCE;
    

  constructor(
    private http: HttpClient,
  ) { }


   getQyas(): Observable<GeneralResponse<entity.QyAListResponse>> {
      const url = `${this.API_URL_PERFORMANCE}/qya/list`;
  
      return this.http
        .get<GeneralResponse<entity.QyAListResponse>>(url)    
      }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
