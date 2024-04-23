import { HttpClient, HttpParams } from '@angular/common/http';
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

  getDataClients(name: string, pageSize: number, page: number): Observable<any> {
    const url = `${this.API_URL_CLIENTS}/clients`;

    const params = new HttpParams()
    .set('name', name)
    .set('pagesize', pageSize)
    .set('page', page);

    return this.http.get<any>(`${url}`, { params });
  }
}
