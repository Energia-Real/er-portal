import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { environment } from '@environment/environment';
import { Observable, Subject, map } from 'rxjs';
import * as entity from './billing-model';
import { FormatsService } from '@app/shared/services/formats.service';
import { Mapper } from './mapper';
import { DataRespSavingDetailsList } from '../plants-main/plants-model';

@Injectable({
  providedIn: 'root',
})
export class BillingService implements OnDestroy {
  private onDestroy$ = new Subject<void>();

  private performanceApiUrl = environment.API_URL_PERFORMANCE;

  constructor(
    private http: HttpClient,
    private formatsService: FormatsService
  ) { }

  getBilling(
    filters: entity.FiltersBilling
  ): Observable<entity.DataBillingTableMapper> {
    const url = `${this.performanceApiUrl}/invoices/receipts`;

    const params = new HttpParams()
      .set('pageSize', filters.pageSize)
      .set('page', filters.page)
      .set('startDate', filters.startDate)
      .set('endDate', filters.endDate!);

    return this.http
      .get<entity.DataBillingTableMapper>(url, { params })
      .pipe(
        map((response) =>
          Mapper.getBillingDataMapper(response, this.formatsService)
        )
      );
  }

  getBillingOverview(
    filters: any
  ): Observable<entity.DataBillingOverviewTableMapper> {
    const url = `${this.performanceApiUrl}/clients/${filters.clientId}/current-invoices`;

    const params = new HttpParams()
      .set('pageSize', filters.pageSize)
      .set('page', filters.page)

    return this.http
      .get<entity.DataBillingOverviewTableMapper>(url, { params })
      .pipe(
        map((response) =>
          Mapper.getBillingOverviewMapper(response, this.formatsService)
        )
      );
  }

  getBillingHistory(
    filters: any
  ): Observable<entity.DataHistoryOverviewTableMapper> {
    const url = `${this.performanceApiUrl}/clients/${filters.clientId}/invoices`;

    const params = new HttpParams()
      .set('page', filters.page)
      .set('pagesize', filters.pageSize)
      .set('year', filters.year)

    return this.http
      .get<entity.DataHistoryOverviewTableMapper>(url, { params })
      .pipe(
        map((response) =>
          Mapper.getBillingHistoryMapper(response, this.formatsService)
        )
      );
  }

  downloadExcelReport(params: { [key: string]: string }): Observable<Blob> {
    const url = `${this.performanceApiUrl}/FacturacionExport/DownloadExcelReport`;

    return this.http.get(url, {
      params,
      responseType: 'blob',
    });
  }

  saveBillingTableData(requestData: entity.UpdateBilling[]): Observable<any> {
    const url = `${this.performanceApiUrl}/invoices/bulk-update`;

    return this.http.put<any>(url, requestData);
  }

  getInvoiceById(id: string) {
    const url = `${this.performanceApiUrl}/invoices/${id}`;

    return this.http.get<entity.InvoiceResponse>(url);
  }

  generateInvoice(data: entity.CreateInvoice): Observable<any> {
    const url = `${this.performanceApiUrl}/invoices/generate`;

    return this.http.post<any>(url, data);
  }

  editInvoice(id: string, data: entity.EditInvoice) {
    const url = `${this.performanceApiUrl}/invoices/${id}`;

    return this.http.put<any>(url, data);
  }

  updateInvoiceStatus(id: string, data: entity.UpdateInvoiceStatus) {
    const url = `${this.performanceApiUrl}/invoices/${id}/status`;

    return this.http.put<any>(url, data);
  }

  updateMultipleInvoiceStatuses(data: entity.PostConfirmInvoices[]) {
    const url = `${this.performanceApiUrl}/invoices/confirm`;

    return this.http.post<entity.UpdateMultipleInvoiceStatusesResponse>(
      url,
      data
    );
  }

  uploadExcel(file: File): Observable<any> {
    const url = `${this.performanceApiUrl}/invoices/upload-excel`;
    const formData: FormData = new FormData();
    formData.append('File', file, file.name);

    return this.http.post<any>(`${url}`, formData);
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
