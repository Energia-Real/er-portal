import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { environment } from '@environment/environment';
import { Observable, Subject, interval, map, takeUntil } from 'rxjs';
import * as entity from './assets-model';
import { Mapper } from './mapper';
import { FormatsService } from '@app/shared/services/formats.service';

@Injectable({
  providedIn: 'root'
})
export class AssetsService implements OnDestroy {
  private onDestroy$ = new Subject<void>();

  private API_URL = environment.API_URL_CLIENTS_V1;
  private API_URL_PROXY = environment.API_URL_PROXY_V1;
  private API_URL_EQUIPMENTS = environment.API_URL_EQUIPMENTS_V1;
  private API_URL_EQUIPMENT_HUAWEI_V1 = environment.API_URL_EQUIPMENT_HUAWEI_V1;

  constructor(private http: HttpClient, public formatsService: FormatsService) { }

  getDataRespOverview(assetId: String): Observable<entity.DataResponseDetailsMapper[]> {
    const url = `${this.API_URL}/projects/${assetId}`;
    return this.http.get<entity.DataResponseDetailsClient>(url).pipe(
      map((response) => Mapper.getDataRespOverviewMapper(response, this.formatsService))
    );
  }

  getDataRespStatus(): Observable<entity.ProjectStatus[]> {
    const url = `${this.API_URL}/projects/projectstate`;

    return this.http.get<entity.ProjectStatus[]>(url).pipe(
      map((response) => Mapper.getDataRespStatusMapper(response, this.formatsService))
    );
  }

  getDataRespUnauthorized(): Observable<any> {
    const url = `${this.API_URL}/pruebas/unauthorized`;
    return this.http.get<any>(url);
  }

  getDataRespSite(data: entity.PostDataByPlant): Observable<entity.DataResponseDetailsMapper[]> {
    const url = `${this.API_URL_PROXY}/integrators/proxy/getSiteDetailsByPlant`;

    return this.http.post<entity.DataResponseDetails>(url, data).pipe(
      map((response) => Mapper.getDataRespSiteMapper(response?.data, this.formatsService))
    );
  }

  getDataSystem(data: entity.PostDataByPlant): Observable<entity.ResponseSystem> {
    const url = `${this.API_URL_PROXY}/integrators/proxy/getStationHealtCheck`;

    return this.http.post<entity.ResponseSystem>(url, data);
  }

  getDataAssetsmanagement(name: string, pageSize: number, page: number): Observable<any> {
    const params = new HttpParams()
      .set('name', name)
      .set('pagesize', pageSize)
      .set('page', page);

    return this.http.get<entity.DataManagementTableResponse>(`${this.API_URL}/projects`, { params }).pipe(
      map((response) => Mapper.getDataAssetsmanagementMapper(response, this.formatsService))
    );
  }

  getSummaryProjects(): Observable<entity.DataSummaryProjectsMapper> {
    const url = `${this.API_URL}/projects/summary`;

    return this.http.get<entity.DataSummaryProjectsMapper>(url).pipe(
      map((response) => Mapper.getSummaryProjects(response, this.formatsService))
    );
  }

  getDataId(id: string | null): Observable<entity.DataPlant> {
    const url = `${this.API_URL}/projects/${id}`;

    return this.http.get<entity.DataPlant>(url).pipe(
      map((response) => Mapper.getDataIdMapper(response))
    );
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

    return this.http.get<entity.DataLocalTime>(`https://maps.googleapis.com/maps/api/timezone/json?`, { params }).pipe(
      map((response) => Mapper.getLocalTimeOfPlaceMapper(response))
    );
  }

  postDataPlant(data: entity.DataPlant) {
    const url = `${this.API_URL}/projects`;

    return this.http.post<any>(url, data);
  }

  patchDataPlant(id: string, data: entity.DataPlant): Observable<any> {
    const url = `${this.API_URL}/projects/${id}/`;

    return this.http.patch<any>(url, data);
  }

  patchDataPlantOverview(id: string, data: Partial<entity.DataResponseDetailsClient>): Observable<any> {
    const url = `${this.API_URL}/projects/${id}/`;

    return this.http.patch<any>(url, data);
  }

  putUpdateAsset(data: any, id: string | null) {
    return this.http.put<any>(`${this.API_URL}/projects/${id}`, data);
  }

  obtenerHoraLocal(): Observable<number> {
    return interval(1000).pipe(
      map(() => Date.now()),
      takeUntil(this.onDestroy$)
    );
  }

  getProyectResume(brand: string, plantCode: string, startDate: Date, endDate: Date) {
    const url = `${this.API_URL_PROXY}/integrators/proxy/GetMonthProyectResume`;
    const jsonObject = {
      "brand": brand,
      "plantCode": plantCode,
    };
    return this.http.post<entity.ProyectResume[]>(url, jsonObject)
  }

  getEstimatedEnergy(brand: string, plantCode: string) {
    const url = `${this.API_URL}/projects/estimatedEnergy`;
    const jsonObject = {
      "brand": brand,
      "plantCode": plantCode,
    };
    return this.http.post<entity.EstimatedEnergy[]>(url, jsonObject)
  }

  getInstalations(plantCode: string) {
    const url = `${this.API_URL_EQUIPMENTS}/equipments/${plantCode}`;
    return this.http.get<entity.Instalations>(url).pipe(
      map((response) => Mapper.getInstalacionesMapper(response))
    );
  }

  getInstalationsInverterMonitoring(plantCode: string): Observable<entity.InverterMonitoring> {
    const url = `${this.API_URL_EQUIPMENT_HUAWEI_V1}/station/${plantCode}/status`;
    return this.http.get<entity.InverterMonitoring>(url)
  }

  createInstalations(equipment: entity.Equipment) {
    const url = `${this.API_URL_EQUIPMENTS}/equipments`;
    return this.http.post<entity.Equipment>(url, equipment)
  }

  deleteInstalation(equipmentId: string) {
    const url = `${this.API_URL_EQUIPMENTS}/equipments/${equipmentId}`;
    return this.http.delete<any>(url)
  }

  patchInstalation(id: string | number | null | undefined, data: Partial<entity.Equipment> | null | undefined): Observable<any> {
    const url = `${this.API_URL_EQUIPMENTS}/equipments/${id}`;
    return this.http.patch<any>(url, data);
  }

  getInverterBrands() {
    const url = `${this.API_URL_EQUIPMENTS}/equipments/getInverterBrands`;
    return this.http.get<entity.CatalogEquipment[]>(url);
  }

  getInverterModels(id: number) {
    const url = `${this.API_URL_EQUIPMENTS}/equipments/getInverterModels/${id}`;
    return this.http.get<entity.CatalogEquipment[]>(url);
  }

  getModuleBrands() {
    const url = `${this.API_URL_EQUIPMENTS}/equipments/getModuleBrands`;
    return this.http.get<entity.CatalogEquipment[]>(url);
  }

  getModuleModels(id: number) {
    const url = `${this.API_URL_EQUIPMENTS}/equipments/getModuleModels/${id}`;
    return this.http.get<entity.CatalogEquipment[]>(url);
  }




  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
