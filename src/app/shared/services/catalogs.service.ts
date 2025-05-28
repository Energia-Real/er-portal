import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environment/environment';
import * as entity from '../models/catalogs-models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CatalogsService {
  private API_URL_PERFORMANCE = environment.API_URL_PERFORMANCE;
  private domainApiUrl = environment.API_URL_DOMAIN_BACKEND;

  constructor(private http: HttpClient) { }

  getCatContractType(): Observable<entity.DataCatalogs[]> {
    const url = `${this.API_URL_PERFORMANCE}/tipodecontrato`;

    return this.http.get<entity.DataCatalogs[]>(url);
  }

  getCatInstallationType(): Observable<entity.DataCatalogs[]> {
    const url = `${this.API_URL_PERFORMANCE}/tipodeinstalacion`;

    return this.http.get<entity.DataCatalogs[]>(url);
  }

  getCatClientType(): Observable<entity.DataCatalogs[]> {
    const url = `${this.API_URL_PERFORMANCE}/tipodecliente`;

    return this.http.get<entity.DataCatalogs[]>(url);
  }

  getCatPlantStatus(): Observable<entity.DataCatalogs[]> {
    const url = `${this.API_URL_PERFORMANCE}/estatusdelaplanta`;

    return this.http.get<entity.DataCatalogs[]>(url);
  }

  getCatalogsBillingDetails(): Observable<any> {
    const url = `${this.domainApiUrl}/v1/Netsuite/Catalogos/ClientesProyectos`;

    return this.http.get<any>(url);
  }

  getClients(): Observable<any> {
    const url = `${this.domainApiUrl}/v1/Netsuite/clientesIndividuales`;

    return this.http.get<any>(url);
  }
}
