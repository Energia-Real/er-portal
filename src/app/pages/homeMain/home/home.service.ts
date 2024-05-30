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
  private API_URL_CLIENTS = environment.API_URL_CLIENTS_V1;

  constructor(
    private http: HttpClient,
    public formatsService: FormatsService
  ) { }

  getDataClients(): Observable<entity.DataRespSavingDetailsMapper> {
    const url = `${this.API_URL_CLIENTS}/projects/savingdetails`;

    return this.http.get<entity.DataRespSavingDetails[]>(url).pipe(
			map((response) => Mapper.getDataClientsMapper(response, this.formatsService))
		);
  }

  getDataClientsList(): Observable<entity.DataRespSavingDetailsList[]> {
    const url = `${this.API_URL_CLIENTS}/clients/list`;

    return this.http.get<entity.DataRespSavingDetailsList[]>(url)
  }
}
