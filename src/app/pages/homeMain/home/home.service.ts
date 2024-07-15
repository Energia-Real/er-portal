import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import * as entity from './home-model';
import { Mapper } from './mapper';
import { environment } from '@environment/environment';
import { FormatsService } from '@app/shared/services/formats.service';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  constructor(
    private http: HttpClient,
    public formatsService: FormatsService
  ) { }

  getDataClients(filters?:string): Observable<entity.DataRespSavingDetailsMapper> {
    const url = `${environment.API_URL_CLIENTS_V1}/projects/savingdetails${filters ? `?${filters}` : ''}`;

    console.log(url);

    return this.http.get<entity.DataRespSavingDetails[]>(url).pipe(
			map((response) => Mapper.getDataClientsMapper(response, this.formatsService))
		);
  }

  getDataClientsList(): Observable<entity.DataRespSavingDetailsList[]> {
    const url = `${environment.API_URL_CLIENTS_V1}/clients/list`;

    return this.http.get<entity.DataRespSavingDetailsList[]>(url)
  }
 
  // getDataCoverageSavings(): Observable<entity.DataRespSavingDetailsList[]> {
  getDataBatuCoverageSavings(id?:string, filters?:any): Observable<any> {
    const url = `${environment.API_URL_BATU_V1}/GetBatu/${id}`;

    return this.http.post<any>(url, filters).pipe(
			map((response) => Mapper.getDataBatuCoverageSavings(response, this.formatsService))
		);
    // return this.http.get<entity.DataRespSavingDetailsList[]>(url)
  }
}
