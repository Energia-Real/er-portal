import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { environment } from '@environment/environment';
import { Observable, Subject, map } from 'rxjs';
import * as entity from './billing-model';
import { FormatsService } from '@app/shared/services/formats.service';
import { Mapper } from './mapper';

@Injectable({
  providedIn: 'root'
})
export class BillingService implements OnDestroy {
  private onDestroy$ = new Subject<void>();

  private API_URL = environment.API_URL_BILL_V1;

  constructor(private http: HttpClient, private formatsService: FormatsService) { }

  getBillingData(filters: entity.FiltersBilling): Observable<entity.DataBillingTableMapper> {
    const url = `${this.API_URL}/Facturacion/GetFacturas`;
    const params = new HttpParams()
      .set('pageSize', filters.pageSize)
      .set('pageNumber', filters.page)
      .set('plantName', filters.plantName)
      .set('startDate', filters.startDate)
      .set('endDate', filters.endDate!)

    return this.http.get<entity.DataTableBillingResponse>(url, { params }).pipe(
      map((response) => Mapper.getBillingDataMapper(response, this.formatsService))
    );
  }

  saveBillingTableData(requestData: any[]): Observable<any> {
    const url = `${this.API_URL}/Facturacion/ConfirmFacturas`;

    return this.http.post<any>(url, requestData)
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
