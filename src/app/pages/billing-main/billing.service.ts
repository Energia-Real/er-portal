import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { environment } from '@environment/environment';
import { Observable, Subject, map } from 'rxjs';
import * as entity from './billing-model';
import { FormatsService } from '@app/shared/services/formats.service';
import { Mapper } from './mapper';
import { DataRespSavingDetailsList } from '../plants-main/plants-model';
import { ChartConfiguration } from 'chart.js';
import { GeneralFilters, GeneralPaginatedResponse, GeneralResponse } from '@app/shared/models/general-models';

@Injectable({
  providedIn: 'root',
})
export class BillingService implements OnDestroy {
  private onDestroy$ = new Subject<void>();

  private performanceApiUrl = environment.API_URL_PERFORMANCE;
  private domainApiUrl = environment.API_URL_DOMAIN_BACKEND;

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

  getBillingSites(
    filters: entity.BillingOverviewFilterData
  ): Observable<GeneralPaginatedResponse<entity.SitesTableRow>> {
    const url = `${this.domainApiUrl}/v1/Netsuite/Sites`;
    return this.http.post<GeneralPaginatedResponse<entity.SitesTableRow>>(url, filters);
  }

  getInvoiceDetailsHeader(
    idClient: number
  ): Observable<entity.InvoiceDetailsCurrencyHeader> {
    const url = `${this.domainApiUrl}/v1/Billing/Invoice/${idClient}`;

    return this.http
      .get<entity.InvoiceDetailsCurrencyHeader>(url);
  }

  getInvoiceDetails(
    filters: any
  ): Observable<entity.DataInvoiceDetailsTableMapper> {
    const url = `${this.domainApiUrl}/v1/Billing/Invoice/Details/${filters.clientId}/`;

    const params = new HttpParams()
      .set('pageSize', filters.pageSize)
      .set('page', filters.page)

    return this.http
      .get<entity.DataInvoiceDetailsTableMapper>(url, { params }).pipe(
        map((response) =>
          Mapper.InvoiceDetailsMapper(response, this.formatsService)
        )
      );;
  }


  getPreviousBillingHistory(
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

  getBillingHistory(filters: entity.BillingOverviewFilterData): Observable<GeneralPaginatedResponse<entity.Bill>> {
    const url = `${this.domainApiUrl}/v1/Billing/History`;
    return this.http.post<any>(url, filters);
  }

  getClientCatalog(): Observable<GeneralResponse<entity.catalogResponseList>> {
    const url = `${this.domainApiUrl}/v1/Billing/Catalog/Clients`;
    return this.http.get<any>(url);
  }

  getLegalNameCatalog(clientId: string): Observable<GeneralResponse<entity.catalogResponseList>> {
    const url = `${this.domainApiUrl}/v1/Billing/Catalog/LegalNames/${clientId}`;
    return this.http.get<any>(url);
  }

  getSitesCatalog(legalName: string): Observable<GeneralResponse<entity.catalogResponseList>> {
    const url = `${this.domainApiUrl}/v1/Billing/Catalog/Sites/${legalName}`;
    return this.http.get<any>(url);
  }

  getProductTypesCatalog(): Observable<GeneralResponse<entity.catalogResponseList>> {
    const url = `${this.domainApiUrl}/v1/Billing/Catalog/ProductTypes`;
    return this.http.get<any>(url);
  }

  getCurrentInvoices(): Observable<GeneralResponse<entity.CurrentBillResponse>> {
    const url = `${this.performanceApiUrl}/Billing/Current`;
    return this.http.post<any>(url, null);
  }

  getBillingDetails(
    filters: any
  ): Observable<entity.DataDetailsOverviewTableMapper> {
    const url = `${this.performanceApiUrl}/invoices/razon-social/${filters.rfc}/detail`;

    const params = new HttpParams()
      .set('page', filters.page)
      .set('pageSize', filters.pageSize)
      .set('year_start', filters.year)
      .set('month_start', filters.month)

    return this.http
      .get<entity.DataDetailsOverviewTableMapper>(url, { params })
      .pipe(
        map((response) =>
          Mapper.getBillingDetailsMapper(response, this.formatsService)
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

  downloadBillingNetsuite(typeDocument: string, idDocument: string): Observable<GeneralResponse<entity.DownloadBillingResponse>> {
    const url = `${this.domainApiUrl}/v1/Billing/Netsuite/Document`;
    const params = { typeDocument, idDocument }

    return this.http.post<GeneralResponse<entity.DownloadBillingResponse>>(url, params);
  }

  downloadBillingADX(typeDocument: string, folioId: string, anio: number, month: number): Observable<GeneralResponse<entity.DownloadBillingResponse>> {
    const url = `${this.domainApiUrl}/v1/Billing/ADX/Document`;
    const params = { typeDocument, folioId, anio, month }

    return this.http.post<GeneralResponse<entity.DownloadBillingResponse>>(url, params);
  }


  downloadBilling(typeFile: string[], billings: string[]): Observable<Blob> {
    const url = `${this.performanceApiUrl}/Billing/Files`;
    const params = { typeFile, billings }

    return this.http.post(url, params, {
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

  getEnergysummaryOverview(filters: entity.BillingOverviewFilterData): Observable<ChartConfiguration<'bar' | 'line'>['data'] | any> {
    const url = `${this.domainApiUrl}/v1/Billing/Energy/SummaryBalance`;

    return this.http.post<GeneralResponse<entity.EnergySummaryResponse>>(url, filters).pipe(
      map((response) =>
        Mapper.getEnergysummaryMapper(response, this.formatsService)
      ));
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
