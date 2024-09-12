import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { environment } from '@environment/environment';
import { Observable, Subject, interval, map, takeUntil } from 'rxjs';
import * as entity from './clients-model';
import { FormatsService } from '@app/shared/services/formats.service';
import { Mapper } from './mapper';
import { DataCatalogs } from '@app/shared/models/catalogs-models';

@Injectable({
  providedIn: 'root'
})
export class ClientsService implements OnDestroy {
  private onDestroy$ = new Subject<void>();

  private API_URL = environment.API_URL_CLIENTS_V1;

  constructor(private http: HttpClient, public formatsService: FormatsService) { }

  getClientsData(name: string, pageSize: number, page: number): Observable<entity.DataTableResponse> {
    const url = `${this.API_URL}/clients`;
    const params = new HttpParams()
      .set('imageSize', 150)
      .set('pagesize', pageSize)
      .set('page', page)
      .set('name', name);

    return this.http.get<entity.DataTableResponse>(url, { params }).pipe(
      map((response) => Mapper.getClientsDataMapper(response))
    );
  }

  getTypeClientsData(): Observable<entity.DataCatalogTypeClient[]> {
		const url = `${this.API_URL}/tipodecliente`;

		return this.http.get<entity.DataCatalogTypeClient[]>(url);
	}

  postDataTypeClient(data: entity.DataPostTypeClient) {
    const url = `${this.API_URL}/tipodecliente`;

    return this.http.post<any>(url, data);
  }

  patchDataTypeClient(id:string, data: entity.DataPatchTypeClient) {
    const url = `${this.API_URL}/tipodecliente/${id}`;
    

    return this.http.put<any>(url, data);
  }

  postDataClient(data: entity.DataPostClient) {
    const url = `${this.API_URL}/clients`;

    const formData = new FormData();

    formData.append('name', data.name);
    formData.append('tipoDeClienteId', data.tipoDeClienteId);

    if (data?.clientId) formData.append('clientId', data?.clientId);
    const imageFile = data.image;
    if (imageFile) formData.append('image', imageFile, imageFile.name);

    return this.http.post<any>(url, formData);
  }

  patchDataClient(id:number, data: entity.DataPatchClient) {
    const url = `${this.API_URL}/clients/${id}`;

    const formData = new FormData();

    formData.append('name', data.name);
    formData.append('tipoDeClienteId', data.tipoDeClienteId);

    if (data?.clientId) formData.append('clientId', data?.clientId);
    const imageFile = data.image;
    if (imageFile) formData.append('image', imageFile, imageFile.name);

    return this.http.put<any>(url, formData);
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
