import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { environment } from '@environment/environment';
import { Observable, Subject, interval, map, takeUntil } from 'rxjs';
import * as entity from './plants-model';
import { FormatsService } from '@app/shared/services/formats.service';
import { Mapper } from './mapper';
import { DataResponseArraysMapper, GeneralFilters, GeneralResponse } from '@app/shared/models/general-models';
import { TranslationService } from '@app/shared/services/i18n/translation.service';

@Injectable({
  providedIn: 'root',
})
export class PlantsService implements OnDestroy {
  private onDestroy$ = new Subject<void>();

  private API_URL_PROYECTS = environment.API_URL_PERFORMANCE;
  private API_URL_PERFORMANCE = environment.API_URL_PERFORMANCE;

  constructor(
    private http: HttpClient,
    private formatsService: FormatsService,
    private translationService: TranslationService
  ) { }

  getDataById(id: string | null): Observable<entity.DataPlant> {
    const url = `${this.API_URL_PROYECTS}/projects/${id}`;

    return this.http
      .get<entity.DataPlant>(url)
      .pipe(map((response) => Mapper.getDataIdMapper(response)));
  }

  getDataRespOverview(
    assetId: String
  ): Observable<entity.DataResponseDetailsCard[]> {
    const url = `${this.API_URL_PROYECTS}/projects/${assetId}`;
    return this.http
      .get<entity.DataResponseDetailsClient>(url)
      .pipe(
        map((response) =>
          Mapper.getDataRespOverviewMapper(response, this.formatsService, this.translationService)
        )
      );
  }

  getDataRespStatus(): Observable<entity.ProjectStatus[]> {
    const url = `${this.API_URL_PROYECTS}/projects/projectstate`;

    return this.http
      .get<entity.ProjectStatus[]>(url)
      .pipe(
        map((response) =>
          Mapper.getDataRespStatusMapper(response, this.formatsService)
        )
      );
  }

  getDataRespUnauthorized(): Observable<any> {
    const url = `${this.API_URL_PROYECTS}/pruebas/unauthorized`;
    return this.http.get<any>(url);
  }

  getSiteDetails(id: string): Observable<DataResponseArraysMapper> {
    const url = `${this.API_URL_PROYECTS}/projects/GetSiteDetailByPlant/${id}`;

    return this.http
      .get<entity.DataSiteDetails>(url)
      .pipe(
        map((response) =>
          Mapper.getSiteDetailsMapper(response, this.formatsService, this.translationService)
        )
      );
  }

  getSitePerformance(
    filters: GeneralFilters
  ): Observable<DataResponseArraysMapper | null> {
    const url = `${this.API_URL_PERFORMANCE}/GetSitePerformance`;

    return this.http
      .post<any>(url, filters)
      .pipe(map((response) => Mapper.getSitePerformanceMapper(response, this.formatsService, this.translationService)));
  }

  getSitePerformanceDetails(
    plantId: string,
    filters: GeneralFilters
  ): Observable<DataResponseArraysMapper | null> {
    const url = `${this.API_URL_PERFORMANCE}/plants/${plantId}/performance`;
    let params = new HttpParams()
      .set('startDate', filters.startDate)
      .set('endDate', filters.endDate!);
    return this.http
      .get<any>(url, { params })
      .pipe(map((response) => Mapper.getSitePerformanceMapper(response, this.formatsService, this.translationService)));
  }

  getSavingDetails(
    filters: GeneralFilters,
    plantId: string
  ): Observable<GeneralResponse<entity.getSavingsDetails>> {
    const url = `${this.API_URL_PERFORMANCE}/plants/${plantId}/saving`;
    let params = new HttpParams()
      .set('startDate', filters.startDate)
      .set('endDate', filters.endDate!);
    return this.http.get<GeneralResponse<entity.getSavingsDetails>>(url, {
      params,
    });
  }

  getPlants(filters: entity.FiltersPlants): Observable<any> {
    const params = new HttpParams()
      .set('name', filters.name)
      .set('pagesize', filters.pageSize)
      .set('page', filters.page);

    return this.http
      .get<entity.DataManagementTableResponse>(`${this.API_URL_PROYECTS}/projects`, { params })
      .pipe(map((response) => Mapper.getPlantsMapper(response, this.formatsService)));
  }

  getSummaryProjects(): Observable<entity.DataSummaryProjectsMapper> {
    const url = `${this.API_URL_PROYECTS}/projects/summary`;

    return this.http
      .get<entity.DataSummaryProjectsMapper>(url)
      .pipe(map((response) => Mapper.getSummaryProjects(response, this.formatsService)));
  }

  getDataClient(): Observable<entity.DataRespSavingDetailsList[]> {
    const url = `${environment.API_URL_PERFORMANCE}/clients/list`;
    const params = new HttpParams().set('imageSize', 50);

    return this.http.get<entity.DataRespSavingDetailsList[]>(url, { params });
  }

  getWeatherData(lat: number, long: number) {
    let latitude = lat.toString();
    let longitude = long.toString();
    return this.http.get<any>(
      `https://api.tomorrow.io/v4/weather/realtime?location=${latitude},${longitude}&apikey=${environment.TOMORROW_KEY}`
    );
  }

  getPlaceAddress(lat: number, long: number) {
    const params = new HttpParams()
      .set('latlng', `${lat},${long}`)
      .set('key', environment.GOOGLE_API_KEY);

    return this.http.get<any>(
      `https://maps.googleapis.com/maps/api/geocode/json?`,
      { params }
    );
  }

  getLocalTimeOfPlace(lat: number, long: number) {
    const params = new HttpParams()
      .set('location', `${lat},${long}`)
      .set('timestamp', `${Math.floor(Date.now() / 1000)}`)
      .set('key', environment.GOOGLE_API_KEY);

    return this.http
      .get<entity.DataLocalTime>(
        `https://maps.googleapis.com/maps/api/timezone/json?`,
        { params }
      )
      .pipe(map((response) => Mapper.getLocalTimeOfPlaceMapper(response)));
  }

  postDataPlant(data: entity.DataPlant) {
    const url = `${this.API_URL_PROYECTS}/projects`;

    return this.http.post<any>(url, data);
  }

  patchDataPlant(id: string, data: entity.DataPlant): Observable<any> {
    const url = `${this.API_URL_PROYECTS}/projects/${id}/`;

    return this.http.patch<any>(url, data);
  }

  patchDataPlantOverview(
    id: string,
    data: Partial<entity.DataResponseDetailsClient>
  ): Observable<any> {
    const url = `${this.API_URL_PROYECTS}/projects/${id}/`;

    return this.http.patch<any>(url, data);
  }

  putUpdateAsset(data: any, id: string | null) {
    return this.http.put<any>(`${this.API_URL_PROYECTS}/projects/${id}`, data);
  }

  obtenerHoraLocal(): Observable<number> {
    return interval(1000).pipe(
      map(() => Date.now()),
      takeUntil(this.onDestroy$)
    );
  }

  getEstimatedEnergy(brand: string, plantCode: string) {
    const url = `${this.API_URL_PROYECTS}/projects/estimatedEnergy`;
    const jsonObject = {
      brand: brand,
      plantCode: plantCode,
    };
    return this.http.post<entity.EstimatedEnergy[]>(url, jsonObject);
  }

  getSavings(plantCode: string) {
    const url = `${this.API_URL_PERFORMANCE}/equipments/${plantCode}`;
    return this.http
      .get<entity.Instalations>(url)
      .pipe(map((response) => Mapper.getInstalacionesMapper(response, this.translationService)));
  }

  getInverterMonitoring(
    plantCode: string
  ): Observable<entity.InverterMonitoring> {
    const url = `${this.API_URL_PERFORMANCE}/station/${plantCode}/status`;
    return this.http.get<entity.InverterMonitoring>(url);
  }

  createInstalations(equipment: entity.Equipment) {
    const url = `${this.API_URL_PERFORMANCE}/equipments`;
    return this.http.post<entity.Equipment>(url, equipment);
  }

  deleteInstalation(equipmentId: string) {
    const url = `${this.API_URL_PERFORMANCE}/equipments/${equipmentId}`;
    return this.http.delete<any>(url);
  }

  patchInstalation(
    id: string | number | null | undefined,
    data: Partial<entity.Equipment> | null | undefined
  ): Observable<any> {
    const url = `${this.API_URL_PERFORMANCE}/equipments/${id}`;
    return this.http.patch<any>(url, data);
  }

  getInverterBrands() {
    const url = `${this.API_URL_PERFORMANCE}/equipments/getInverterBrands`;
    return this.http.get<entity.CatalogEquipment[]>(url);
  }

  getInverterModels(id: number) {
    const url = `${this.API_URL_PERFORMANCE}/equipments/getInverterModels/${id}`;
    return this.http.get<entity.CatalogEquipment[]>(url);
  }

  getModuleBrands() {
    const url = `${this.API_URL_PERFORMANCE}/equipments/getModuleBrands`;
    return this.http.get<entity.CatalogEquipment[]>(url);
  }

  getModuleModels(id: number) {
    const url = `${this.API_URL_PERFORMANCE}/equipments/getModuleModels/${id}`;
    return this.http.get<entity.CatalogEquipment[]>(url);
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
