import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import * as entity from './home-model';
import { Mapper } from './mapper';
import { environment } from '@environment/environment';

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  private API_URL_CLIENTS = environment.API_URL_CLIENTS_V1;


  constructor(
    private http: HttpClient
  ) { }

  getDataClients(): Observable<entity.DataRespSavingDetails[]> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      })
    };
    const url = `${this.API_URL_CLIENTS}/projects/savingdetails`;

    return this.http.get<entity.DataRespSavingDetails[]>(url, httpOptions);
  }
}
