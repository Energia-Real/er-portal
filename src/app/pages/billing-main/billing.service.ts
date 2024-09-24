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

  private API_URL = environment.API_URL_CLIENTS_V1;

  constructor(private http: HttpClient, public formatsService: FormatsService) { }

  getBillingData(name: string, pageSize: number, page: number): Observable<entity.DataBillingTableMapper> {
    const url = `${this.API_URL}/billing`;
    const params = new HttpParams()
      .set('pagesize', pageSize)
      .set('page', page)
      .set('name', name);

    return this.http.get<entity.DataTableBillingResponse>(url, { params }).pipe(
      map((response) => Mapper.getBillingDataMapper(response))
    );
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
