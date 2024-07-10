import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { environment } from '@environment/environment';
import { Observable, Subject, interval, map, takeUntil } from 'rxjs';
import * as entity from './payments-model';
// import { Mapper } from './mapper';
import { FormatsService } from '@app/shared/services/formats.service';
import { Mapper } from './mapper';

@Injectable({
  providedIn: 'root'
})
export class PaymentService implements OnDestroy {
  private onDestroy = new Subject<void>();

  private API_URL = environment.API_URL_CLIENTS_V1;
  private API_URL_PROXY = environment.API_URL_PROXY_V1;
  private API_URL_EQUIPMENTS = environment.API_URL_EQUIPMENTS_V1;

  constructor(private http: HttpClient, public formatsService: FormatsService) { }

  // getDataRespOverview(assetId: String): Observable<entity.DataResponseDetailsMapper[]> {
  //   const url = `${this.API_URL}/projects/${assetId}`;
  //   return this.http.get<entity.DataResponseDetailsClient>(url).pipe(
  //     map((response) => Mapper.getDataRespOverviewMapper(response, this.formatsService))
  //   );
  // }

  ngOnDestroy() {
    this.onDestroy.next();
    this.onDestroy.complete();
  }
}
