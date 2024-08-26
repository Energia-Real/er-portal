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
  private onDestroy = new Subject<void>();

  private API_URL = environment.API_URL_CLIENTS_V1;

  constructor(private http: HttpClient, public formatsService: FormatsService) { }

  getClientsData(name: string, pageSize: number, page: number): Observable<entity.DataTableResponse> {
    const url = `${this.API_URL}/clients`;
    const params = new HttpParams()
      .set('name', name)
      .set('pagesize', pageSize)
      .set('page', page);

    return this.http.get<entity.DataTableResponse>(url, { params }).pipe(
      map((response) => Mapper.getClientsDataMapper(response))
    );
  }

  getTypeClientsData(): Observable<DataCatalogs[]> {
		const url = `${this.API_URL}/tipodecliente`;

		return this.http.get<DataCatalogs[]>(url);
	}

  postDataClient(data: entity.DataPostPatchClient) {
    const url = `${this.API_URL}/clients`;

    return this.http.post<any>(url, data);
  }

  patchDataClient(data: entity.DataPostPatchClient) {
    const url = `${this.API_URL}/clients`;

    return this.http.patch<any>(url, data);
  }

  ngOnDestroy() {
    this.onDestroy.next();
    this.onDestroy.complete();
  }
}
