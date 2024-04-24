import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { environment } from '@environment/environment';
import { Observable, Subject, interval, map, takeUntil } from 'rxjs';
import * as entity from './assets-model';
import { Mapper } from './mapper';

@Injectable({
  providedIn: 'root'
})
export class AssetsService implements OnDestroy{
  private onDestroy = new Subject<void>();

  private API_URL = environment.API_URL_CLIENTS_V1;
  private API_URL_PROXY = environment.API_URL_PROXY_V1;

  constructor(private http: HttpClient) { }

  getDataRespOverview(data:entity.PostDataByPlant): Observable<entity.DataResponseDescription> {
		const url = `${this.API_URL_PROXY}/integrators/proxy/GetOverviewByPlant`;

    return this.http.post<entity.DataResponseDescription>(url, data);
	}
 
  getDataRespSite(data:entity.PostDataByPlant): Observable<entity.DataResponseDetails> {
		const url = `${this.API_URL_PROXY}/integrators/proxy/getSiteDetailsByPlant`;

    return this.http.post<entity.DataResponseDetails>(url, data);
	}
  
  getDataSystem(data:entity.PostDataByPlant): Observable<entity.ResponseSystem> {
		const url = `${this.API_URL_PROXY}/integrators/proxy/getStationHealtCheck`;

    return this.http.post<entity.ResponseSystem>(url, data);
	}

  getDataAssetsmanagement(name: string, pageSize: number, page: number): Observable<any> {
    const params = new HttpParams()
    .set('name', name)
    .set('pagesize', pageSize)
    .set('page', page);

    return this.http.get<any>(`${this.API_URL}/projects`, { params });
  }

  getSummaryProjects() {
    const url = `${this.API_URL}/projects/summary`;

    return this.http.get<any>(url);
  }

  getDetailAsset(id: string | null) : Observable<entity.DataDetailAsset> {
    const url = `${this.API_URL}/projects/${id}`;

    return this.http.get<entity.DataDetailAsset>(url);
  }

  getWeatherData(lat: number, long: number) {
    let latitude = lat.toString();
    let longitude = long.toString();
    return this.http.get<any>(`https://api.tomorrow.io/v4/weather/realtime?location=${latitude},${longitude}&apikey=8lD2yWTpkIuHYCXCXNtBhMkeghYU4dau`);
  }

  getPlaceAddress(lat: number, long: number) {
    const params = new HttpParams()
    .set('latlng', `${lat},${long}`)
    .set('key', "AIzaSyAm6X3YpXfXqYdRANKV4AADLZPkedrwG2k");

    return this.http.get<any>(`https://maps.googleapis.com/maps/api/geocode/json?`, { params })
  }

  getLocalTimeOfPlace(lat: number, long: number) {
    const params = new HttpParams()
    .set('location', `${lat},${long}`)
    .set('timestamp', `${Math.floor(Date.now() / 1000)}`)
    .set('key', "AIzaSyAm6X3YpXfXqYdRANKV4AADLZPkedrwG2k");

    return this.http.get<any>(`https://maps.googleapis.com/maps/api/timezone/json?`, { params }).pipe(
			map((response) => Mapper.getLocalTimeOfPlaceMapper(response))
		);
  }

  postCreateAsset(data: any) {
    return this.http.post<any>(`${this.API_URL}/projects`, data);
  }

  putUpdateAsset(data: any, id: string | null) {
    return this.http.put<any>(`${this.API_URL}/projects/${id}`, data);
  }

  obtenerHoraLocal(): Observable<number> {
    return interval(1000).pipe(
      map(() => Date.now()),
      takeUntil(this.onDestroy)
    );
  }

  ngOnDestroy() {
    this.onDestroy.next();
    this.onDestroy.complete();
  }

}
