import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environment/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AssetsService {

  private API_URL = environment.API_URL_ASSETS_V1;

  constructor(private http: HttpClient) { }

  getDataAssetsmanagement(name: string, pageSize: number, page: number): Observable<any> {
    const params = new HttpParams()
    .set('name', name)
    .set('pagesize', pageSize)
    .set('page', page);

    return this.http.get<any>(`${this.API_URL}/projects`, { params });
  }

  getSummaryProjects() {
    return this.http.get<any>(`${this.API_URL}/projects/summary`);
  }

  getDetailAsset(id: string | null) {
    return this.http.get<any>(`${this.API_URL}/projects/${id}`);
  }

  getDataWeather(lat: string, long: string) {
    return this.http.get<any>(`https://api.tomorrow.io/v4/weather/realtime?location=${lat},${long}&apikey=8lD2yWTpkIuHYCXCXNtBhMkeghYU4dau`);
  }

  getLatAndLong() {
    const address = 'ChIJeRpOeF67j4AR9ydy_PIzPuM';
    const params = new HttpParams()
    .set('place_id', address)
    .set('key', environment.GOOGLE_API_KEY)
    return this.http.get<any>(`https://maps.googleapis.com/maps/api/geocode/json?`, { params })
  }

  postCreateAsset(data: any) {
    return this.http.post<any>(`${this.API_URL}/projects`, data);
  }

  putUpdateAsset(data: any, id: string | null) {
    return this.http.put<any>(`${this.API_URL}/projects/${id}`, data);
  }
}
