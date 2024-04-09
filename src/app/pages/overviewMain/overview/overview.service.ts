import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import * as entity from './overview-model';
import { Mapper } from './mapper';
import { environment } from '@environment/environment';

@Injectable({
  providedIn: 'root'
})
export class CatchmentService {
  // private apiUrl = `${environment.apiURL}catch/`;
  private apiUrl = ``;

  constructor(
    private http: HttpClient
  ) { }

  public getExample(filters?:string): Observable<entity.ExampleMapper[]> {
		const url = `${this.apiUrl}`;

    return this.http.get<entity.Example[]>(url).pipe(
			map((response) => Mapper.getDataExample(response))
		);
	}
}
