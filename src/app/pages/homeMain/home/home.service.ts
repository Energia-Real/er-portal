import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import * as entity from './home-model';
import { Mapper } from './mapper';
import { environment } from '@environment/environment';
import { FormatsService } from '@app/shared/services/formats.service';
import { GeneralFilters, GeneralResponse } from '@app/shared/models/general-models';

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  private performanceApiUrl = environment.API_URL_PERFORMANCE;

  constructor(
    private http: HttpClient,
    public formatsService: FormatsService
  ) { }

  getDataClients(filters: entity.GeneralFilters): Observable<entity.DataRespSavingDetailsMapper> {
    const url = `${environment.API_URL_PERFORMANCE}/energy-performance/sites`;

    return this.http.post<entity.DataTablePlantsResponse>(url, filters).pipe(
      map((response) => Mapper.getDataClientsMapper(response, this.formatsService))
    );
  }

  getDataSavingDetails(filters: GeneralFilters): Observable<entity.SDResponse> {
    const url = `${this.performanceApiUrl}/performance/details`;

    const params = new HttpParams()
    .set('startDate', filters.startDate)
    .set('endDate', filters.endDate!)

    return this.http.get<entity.SavingDetailsResponse>(url, { params }).pipe(
      map((response) => Mapper.getDataSavingDetailsMapper(response, this.formatsService))
    );
  }

  getCo2Saving(filters: entity.GeneralFilters): Observable<entity.Co2SavingResponse> {
    const url = `${this.performanceApiUrl}/savings/Co2`;
    const params = new HttpParams()
      .set('ClientId', filters.clientId)
      .set('startDate', filters.startDate)
      .set('endDate', filters.endDate!)

    return this.http.get<entity.Co2Saving>(url, { params }).pipe(
      map((response) => Mapper.getCo2SavingMapper(response, this.formatsService))
    );
  }

  getDataStates(filters: entity.GeneralFilters): Observable<GeneralResponse<entity.MapStatesResponse>> {
    const url = `${environment.API_URL_PERFORMANCE}/client/${filters.clientId}/state`;
    const params = new HttpParams()
    .set('startDate', filters.startDate)
    .set('endDate', filters.endDate!)

    return this.http.get<GeneralResponse<entity.MapStatesResponse>>(url, { params })
  }

  getDataClientsList(): Observable<entity.DataRespSavingDetailsList[]> {
    const url = `${environment.API_URL_CLIENTS_V1}/clients/list`;
    const params = new HttpParams()
      .set('imageSize', 50)

    return this.http.get<entity.DataRespSavingDetailsList[]>(url, { params }).pipe(
      map((response) => Mapper.getDataClientsListMapper(response))
    );
  }

  getDataSolarCoverage(filters: entity.GeneralFilters): Observable<string> {
    const url = `${environment.API_URL_CLIENTS_V1}/projects/solar-coverage`;
    const params = new HttpParams()
      .set('client', filters.clientId)
      .set('start_date', filters.startDate)
      .set('end_date', filters.endDate!)

    return this.http.get<string>(url, { params })
  }

  getSavings(filters: entity.GeneralFilters): Observable<GeneralResponse<entity.EconomicSavings>> {
    const url = `${environment.API_URL_PERFORMANCE}/saving/details`;
    return this.http.post<GeneralResponse<entity.EconomicSavings>>(url, filters)
  }
}
