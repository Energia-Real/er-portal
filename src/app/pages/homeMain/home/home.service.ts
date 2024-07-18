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

  getDataClients(filters?: string): Observable<entity.DataRespSavingDetailsMapper> {
    const url = `${environment.API_URL_CLIENTS_V1}/projects/savingdetails`;

    return this.http.post<entity.DataRespSavingDetails[]>(url, filters).pipe(
      map((response) => Mapper.getDataClientsMapper(response, this.formatsService))
    );
  }

  getDataClientsList(): Observable<entity.DataRespSavingDetailsList[]> {
    const url = `${environment.API_URL_CLIENTS_V1}/clients/list`;

    return this.http.get<entity.DataRespSavingDetailsList[]>(url)
  }

  getDataSolarCovergaCo2(filters?: any) : Observable<entity.FormatCards[]> {
    const url = `${environment.API_URL_PROXY_V1}/integrators/proxy/GetGlobalSolarCoverage`;

    return this.http.post<entity.DataSolarCovergaCo2>(url, filters).pipe(
      map((response) => Mapper.getDataSolarCovergaCo2(response, this.formatsService))
    );
  }

  // getDataCoverageSavings(): Observable<entity.DataRespSavingDetailsList[]> {
  getDataBatuSavings(id?: string, filters?: any): Observable<any> {
    const url = `${environment.API_URL_BATU_V1}/GetBatu/${id}`;

    return this.http.post<any>(url, filters).pipe(
      map((response) => Mapper.getDataBatuSavings(response, this.formatsService))
    );
    // return this.http.get<entity.DataRespSavingDetailsList[]>(url)
  }
}
