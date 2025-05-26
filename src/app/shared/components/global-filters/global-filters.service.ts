import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '@environment/environment';
import { FormatsService } from '@app/shared/services/formats.service';
import { Mapper } from './mapper';

@Injectable({
  providedIn: 'root'
})
export class GlobalFiltersService {
  private domainApiUrl = environment.API_URL_DOMAIN_BACKEND;

  constructor(
    private http: HttpClient,
    public formatsService: FormatsService
  ) { }

  getCatalogsBillingDetails(): Observable<any> {
    const url = `${this.domainApiUrl}/v1/Netsuite/Catalogos/ClientesProyectos`;

    return this.http.get<any>(url).pipe(
      map((response) => Mapper.getDataFilters(response, this.formatsService))
    );
  }
}
