import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environment/environment';
import * as entity from '../models/catalogs-models';
import { Observable } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class CatalogsService {

	private API_URL_CLIETNS = environment.API_URL_CLIENTS_V1;

	constructor(private http: HttpClient) { }

	getCatContractType(): Observable<entity.DataCatalogs[]> {
		const url = `${this.API_URL_CLIETNS}/tipodecontrato`;

		return this.http.get<entity.DataCatalogs[]>(url);
	}

	getCatInstallationType(): Observable<entity.DataCatalogs[]> {
		const url = `${this.API_URL_CLIETNS}/tipodeinstalacion`;

		return this.http.get<entity.DataCatalogs[]>(url);
	}

	getCatClientType(): Observable<entity.DataCatalogs[]> {
		const url = `${this.API_URL_CLIETNS}/tipodecliente`;

		return this.http.get<entity.DataCatalogs[]>(url);
	}
	
	getCatPlantStatus(): Observable<entity.DataCatalogs[]> {
		const url = `${this.API_URL_CLIETNS}/estatusdelaplanta`;

		return this.http.get<entity.DataCatalogs[]>(url);
	}

}
