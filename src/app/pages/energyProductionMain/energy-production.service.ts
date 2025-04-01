import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { environment } from '@environment/environment';
import { Observable, Subject, interval, map, takeUntil } from 'rxjs';
import { FormatsService } from '@app/shared/services/formats.service';
import { DataCatalogs } from '@app/shared/models/catalogs-models';
import { Mapper } from './mapper';
import * as entity from './energy-production-model';

@Injectable({
  providedIn: 'root'
})
export class EnergyProductionService implements OnDestroy {
  private onDestroy$ = new Subject<void>();

  private API_URL = environment.API_URL_PERFORMANCE;

  constructor(private http: HttpClient, public formatsService: FormatsService) { }

  getEnergyProdData(filters:entity.FiltersEnergyProd): Observable<entity.DataEnergyProdTablMapper> {
    const url = `${this.API_URL}/GetEnergyProduced/${filters.year}`;
    const params = new HttpParams()
      .set('pagesize', filters.pageSize)
      .set('page', filters.page)
      .set('name', filters.name);

    return this.http.get<entity.DataTableEnergyProdResponse>(url, { params }).pipe(
      map((response) => Mapper.getEnergyProdDataDataMapper(response, this.formatsService))
    );
  }

  getEnergyConsumptionData(filters:entity.FiltersEnergyProd): Observable<entity.DataEnergyProdTablMapper> {
    const url = `${this.API_URL}/GetEnergyConsumption/${filters.year}`;
    const params = new HttpParams()
      .set('pagesize', filters.pageSize)
      .set('page', filters.page)
      .set('name', filters.name);

    return this.http.get<entity.DataTableEnergyProdResponse>(url, { params }).pipe(
      map((response) => Mapper.getEnergyProdDataDataMapper(response, this.formatsService))
    );
  }

  getEnergyEstimatedData(filters:entity.FiltersEnergyProd): Observable<entity.DataEnergyProdTablMapper> {
    const url = `${this.API_URL}/GetEnergyEstimated/${filters.year}`;
    const params = new HttpParams()
      .set('pagesize', filters.pageSize)
      .set('page', filters.page)
      .set('name', filters.name);

    return this.http.get<entity.DataTableEnergyProdResponse>(url, { params }).pipe(
      map((response) => Mapper.getEnergyProdDataDataMapper(response, this.formatsService))
    );
  }


  postDataEnergyProd(data: entity.DataPostEnergyProd) {
    const url = `${this.API_URL}/AddEnergyProduced`;

    return this.http.post<any>(url, data);
  }

  patchDataEnergyProd(data: entity.DataPatchEnergyProd) {
    const url = `${this.API_URL}/energy/Production`;

    return this.http.put<any>(url, data);
  }

  patchDataEnergyCon(data: entity.DataPatchEnergyProd) {
    const url = `${this.API_URL}/energy/Consumption`;

    return this.http.put<any>(url, data);
  }

  
  patchDataEnergyEstim(data: entity.DataPatchEnergyProd) {
    const url = `${this.API_URL}/energy/Estimated`;

    return this.http.put<any>(url, data);
  }
  
  downloadExcel(): Observable<Blob> {
    const url = `${this.API_URL}/DownloadExcelTemplate`;

    return this.http.get(url, { responseType: 'blob' });
  }

  uploadExcel(file: File): Observable<any> {
    const url = `${this.API_URL}/UploadTemplateFile`;
    const formData: FormData = new FormData();
    formData.append('excelFile', file, file.name);

    return this.http.post<any>(`${url}`, formData);
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
