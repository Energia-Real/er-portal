import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { environment } from '@environment/environment';
import { Observable, Subject, map } from 'rxjs';
import * as entity from './billing-model';
import { FormatsService } from '@app/shared/services/formats.service';
import { Mapper } from './mapper';
import { DataRespSavingDetailsList } from '../plants-main/plants-model';

@Injectable({
  providedIn: 'root'
})
export class BillingService implements OnDestroy {
  private onDestroy$ = new Subject<void>();

  private billingApiUrl = environment.API_URL_BILL_V1;
  private performanceApiUrl = environment.API_URL_PERFORMANCE;
  private performanceV2ApiUrl = environment.API_URL_PERFORMANCE_V2;

  constructor(private http: HttpClient, private formatsService: FormatsService) { }

  getBillingData(filters: entity.FiltersBilling): Observable<entity.DataBillingTableMapper> {
    const url = `${this.performanceApiUrl}/invoices`;

    const params = new HttpParams()
      .set('pageSize', filters.pageSize)
      .set('page', filters.page)
      .set('plantName', filters.plantName)
      .set('startDate', filters.startDate)
      .set('endDate', filters.endDate!)

    return this.http.get<entity.DataBillingTableMapper>(url, { params }).pipe(
      map((response) => Mapper.getBillingDataMapper(response, this.formatsService))
    );
  }

  downloadExcelReport(params: { [key: string]: string }): Observable<Blob> {
    const url = `${this.billingApiUrl}/FacturacionExport/DownloadExcelReport`;

    return this.http.get(url, {
      params, 
      responseType: 'blob' 
    });
  }

  saveBillingTableData(requestData: entity.UpdateBilling[]): Observable<any> {
    const url = `${this.performanceV2ApiUrl}/invoices/bulk-update`;

    return this.http.put<any>(url, requestData);
  }

  getInvoiceById(id: string) {
    const url = `${this.billingApiUrl}/invoices/${id}`;

    return this.http.get<entity.InvoiceResponse>(url);
  }

  generateInvoice(data: entity.CreateInvoice): Observable<any> {
    const url = `${this.performanceApiUrl}/invoices/generate`;

    return this.http.post<any>(url, data);
  }

  editInvoice(id: string, data: entity.EditInvoice) {
    const url = `${this.billingApiUrl}/invoices${id}`;

    return this.http.put<any>(url, data);
  }

  updateInvoiceStatus(id: string, data: entity.UpdateInvoiceStatus) {
    const url = `${this.billingApiUrl}/invoices${id}/status`;

    return this.http.put<any>(url, data);
  }

  updateMultipleInvoiceStatuses(data: entity.PostConfirmInvoices[]) {
    const url = `${this.performanceApiUrl}/invoices/confirm`;

    return this.http.post<entity.UpdateMultipleInvoiceStatusesResponse>(url, data);
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
