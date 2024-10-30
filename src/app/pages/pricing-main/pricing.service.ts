import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { environment } from '@environment/environment';
import { Observable, Subject, map } from 'rxjs';
import * as entity from './pricing-model';
import { FormatsService } from '@app/shared/services/formats.service';
import { Mapper } from './mapper';

@Injectable({
  providedIn: 'root'
})
export class PricingService implements OnDestroy {
  private onDestroy$ = new Subject<void>();

  private API_URL = environment.API_URL_BILL_V1;

  constructor(private http: HttpClient, public formatsService: FormatsService) { }

  getPricingData(filters: any, pageSize: number, page: number): Observable<entity.DataPricingTableMapper> {
    const url = `${this.API_URL}/Tarifa/GetTarifas`;
    const params = new HttpParams()
      .set('pageSize', pageSize)
      .set('pageNumber', page)
      .set('plantName', filters.name)
      .set('year', filters.year)
      .set('month', filters.month)

    return this.http.get<entity.DataTablePricingResponse>(url, { params }).pipe(
      map((response) => Mapper.getPricingDataMapper(response))
    );
  }

  downloadExcel(): Observable<Blob> {
    const url = `${this.API_URL}/FileManagement/DownloadTemplateExcel`;

    return this.http.get(url, { responseType: 'blob' });
  }

  uploadExcel(file: File): Observable<any> {
    const url = `${this.API_URL}/FileManagement/UploadTemplate`;
    const formData: FormData = new FormData();
    formData.append('excelFile', file, file.name);

    return this.http.post<any>(`${url}`, formData);
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
