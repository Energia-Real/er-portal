import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { environment } from '@environment/environment';
import { Observable, Subject, map } from 'rxjs';
import * as entity from './clients-model';
import { FormatsService } from '@app/shared/services/formats.service';
import { Mapper } from './mapper';
import { GeneralResponse, NotificationMessages } from '@app/shared/models/general-models';

@Injectable({
  providedIn: 'root',
})
export class ClientsService implements OnDestroy {
  private onDestroy$ = new Subject<void>();

  private API_URL = environment.API_URL_PERFORMANCE;

  constructor(
    private http: HttpClient,
    public formatsService: FormatsService
  ) {}

  getClientsData(filters:entity.FiltersClients): Observable<entity.DataTableResponse> {
    const url = `${this.API_URL}/clients`;
    const params = new HttpParams()
      .set('imageSize', 150)
      .set('pagesize', filters.pageSize)
      .set('page', filters.page)
      .set('name', filters.name);

    return this.http
      .get<entity.DataTableResponse>(url, { params })
      .pipe(map((response) => Mapper.getClientsDataMapper(response)));
  }

  getTypeClientsData(): Observable<entity.DataCatalogTypeClient> {
    const url = `${this.API_URL}/tipodecliente`;

    return this.http.get<entity.DataCatalogTypeClient>(url);
  }

  postDataTypeClient(data: entity.DataPostTypeClient) {
    const url = `${this.API_URL}/tipodecliente`;

    return this.http.post<any>(url, data);
  }

  patchDataTypeClient(id: string, data: entity.DataPatchTypeClient) {
    const url = `${this.API_URL}/tipodecliente/${id}`;

    return this.http.put<any>(url, data);
  }

  postDataClient(
    data: entity.DataPostClient,
    notificationMessages: NotificationMessages
  ) {
    const url = `${this.API_URL}/clients`;
    const formData = new FormData();
    const headers = new HttpHeaders({
      NotificationMessages: JSON.stringify(notificationMessages),
    });

    formData.append('name', data.name);
    formData.append('tipoDeClienteId', data.tipoDeClienteId);
    formData.append('clientId', data.clientId!);


    const imageFile = data.image;
    if (imageFile) formData.append('image', imageFile, imageFile.name);

    return this.http.post<any>(url, formData, { headers });
  }

  patchDataClient(
    id: number,
    data: entity.DataPatchClient,
    notificationMessages: NotificationMessages
  ) {
    const url = `${this.API_URL}/clients/${id}`;
    const formData = new FormData();
    const headers = new HttpHeaders({
      NotificationMessages: JSON.stringify(notificationMessages),
    });

    formData.append('name', data.name);
    formData.append('tipoDeClienteId', data.tipoDeClienteId);

    if (data?.clientId) formData.append('clientId', data?.clientId);

    const imageFile = data.image;
    if (imageFile) formData.append('image', imageFile, imageFile.name);

    return this.http.put<any>(url, formData, { headers });
  }

  getClientsList(){
    const url = `${this.API_URL}/clients/list`;
    return this.http.get<entity.DataCientList[]>(url);
  }

  getCorporates(clientId:string){
    const url = `${this.API_URL}/clients/${clientId}/razon-social`;
    return this.http.get<GeneralResponse<entity.DataCorporateResponse>>(url);
  }

  getPlantsWithoutCorporate(){
    const url = `${this.API_URL}/projects/ProjectsWithoutRazonSocial`;
    return this.http.get<GeneralResponse<entity.DataPlantWhitoutCorporateResponse>>(url);
  }

  postRazonSocial(
    data: entity.DataPostRazonSocial[],
    clientId:any,
    notificationMessages: NotificationMessages
  ) {
    const url = `${this.API_URL}/clients/${clientId}/razon-social`;
    const formData = new FormData();
    const headers = new HttpHeaders({
      NotificationMessages: JSON.stringify(notificationMessages),
    });




    return this.http.post<any>(url, data,{ headers });
  }

  patchRazonSocial(
    data: any[],
    clientId:string,
    notificationMessages: NotificationMessages
  ) {
    const url = `${this.API_URL}/clients/${clientId}/razon-social`;
    const formData = new FormData();
    const headers = new HttpHeaders({
      NotificationMessages: JSON.stringify(notificationMessages),
    });




    return this.http.put<any>(url, data,{ headers });
  }


  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
