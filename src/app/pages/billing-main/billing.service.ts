import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { environment } from '@environment/environment';
import { Observable, Subject, catchError, map, throwError } from 'rxjs';
import * as entity from './billing-model';
import { FormatsService } from '@app/shared/services/formats.service';
import { Mapper } from './mapper';
import { DataRespSavingDetailsList } from '../plants-main/plants-model';

@Injectable({
  providedIn: 'root'
})
export class BillingService implements OnDestroy {
  private onDestroy$ = new Subject<void>();

  private API_URL = environment.API_URL_BILL_V1;
  private API_URL_PERFORMANCE = environment.API_URL_PERFORMANCE;
  private API_URL_PERFORMANCE_ADD = environment.API_URL_PERFORMANCE_ADD;

  constructor(private http: HttpClient, private formatsService: FormatsService) { }

  getBillingData(filters: entity.FiltersBilling): Observable<entity.DataBillingTableMapper> {
    const url = `${this.API_URL_PERFORMANCE}/invoices`;

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

  getDataClientsList(): Observable<DataRespSavingDetailsList[]> {
    const url = `${environment.API_URL_CLIENTS_V1}/clients/list`;
    const params = new HttpParams()
    .set('imageSize', 50)

    return this.http.get<DataRespSavingDetailsList[]>(url, { params })
  }

  downloadExcelReport(params: { [key: string]: string }): Observable<Blob> {
    const url = `${this.API_URL}/FacturacionExport/DownloadExcelReport`;

    return this.http.get(url, {
      params, 
      responseType: 'blob' 
    });
  }

// ***
  saveBillingTableData(requestData: any[]): Observable<any> {
    const url = `${this.API_URL}/Facturacion/ConfirmFacturas`;

    return this.http.post<any>(url, requestData)
  }

  getInvoiceById(id: string) {
    const url = `${this.API_URL}/invoices/${id}`;

    return this.http.get<entity.InvoiceResponse>(url);
  }

  // generateInvoice(data: entity.CreateInvoice) {
  //   const url = `${this.API_URL_PERFORMANCE}/invoices/generate`;

  //   return this.http.post<any>(url, data);
  // }

  generateInvoice(data: entity.CreateInvoice): Observable<any> {
    const url = `${this.API_URL_PERFORMANCE}/invoices/generate`;

    return this.http.post<any>(url, data)
    
    // .pipe(
    //   catchError((error: HttpErrorResponse) => {
    //     // Aquí logueas el error completo
    //     console.log('Error al generar la factura:', error);

    //     // Puedes extraer el mensaje de error
    //     let errorMessage = 'Error desconocido';
    //     if (error?.error?.errors?.errors) {
    //       errorMessage = error.error.errors.errors.map((e: any) => e.descripcion).join(', ');
    //     } else if (error?.message) {
    //       errorMessage = error.message;
    //     }

    //     // Regresar el error para que el componente pueda manejarlo si es necesario
    //     return throwError(errorMessage);
    //   })
    // );
  }

  editInvoice(id: string, data: entity.EditInvoice) {
    const url = `${this.API_URL}/invoices${id}`;

    return this.http.put<any>(url, data);
  }

  updateInvoiceStatus(id: string, data: entity.UpdateInvoiceStatus) {
    const url = `${this.API_URL}/invoices${id}/status`;

    return this.http.put<any>(url, data);
  }

  updateMultipleInvoiceStatuses(data: entity.UpdateMultipleInvoiceStatuses) {
    const url = `${this.API_URL}/invoices/status`;

    return this.http.put<entity.UpdateMultipleInvoiceStatusesResponse>(url, data);
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
