import { HttpClient, HttpParams } from '@angular/common/http';
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

  private API_URL = environment.API_URL_ENERGY_PERFORMANCE_V1;

  constructor(private http: HttpClient, public formatsService: FormatsService) { }

  getEnergyProdData(year:string, pageSize: number, page: number): Observable<entity.DataEnergyProdTablMapper> {
    const url = `${this.API_URL}/GetEnergyProduced/${year}`;
    const params = new HttpParams()
    .set('pagesize', pageSize)
    .set('page', page);

    return this.http.get<entity.DataTableEnergyProdResponse>(url, { params }).pipe(
      map((response) => Mapper.getEnergyProdDataDataMapper(response))
    );
  }

  postDataEnergyProd(data: entity.DataPostEnergyProd) {
    const url = `${this.API_URL}/AddEnergyProduced`;

    return this.http.post<any>(url, data);
  }

  patchDataEnergyProd(data: entity.DataPatchEnergyProd) {
    const url = `${this.API_URL}/EditEnergyProduced`;
    
    return this.http.put<any>(url, data);
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
