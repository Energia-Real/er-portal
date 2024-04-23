import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AssetsService } from '../assets.service';
import { OpenModalsService } from '@app/shared/services/openModals.service';
import * as entity from '../assets-model';

@Component({
  selector: 'app-details-container',
  templateUrl: './details-container.component.html',
  styleUrl: './details-container.component.scss'
})
export class DetailsContainerComponent implements OnInit, OnDestroy {
  private onDestroy = new Subject<void>();

  weatherData: any = null

  // weatherData: any = {
  //   "cloudBase": null,
  //   "cloudCeiling": null,
  //   "cloudCover": 0,
  //   "dewPoint": -0.88,
  //   "freezingRainIntensity": 0,
  //   "humidity": 38,
  //   "precipitationProbability": 0,
  //   "pressureSurfaceLevel": 780.68,
  //   "rainIntensity": 0,
  //   "sleetIntensity": 0,
  //   "snowIntensity": 0,
  //   "temperature": 13.38,
  //   "temperatureApparent": 13.38,
  //   "uvHealthConcern": 0,
  //   "uvIndex": 0,
  //   "visibility": 16,
  //   "weatherCode": 8000,
  //   "windDirection": 94.38,
  //   "windGust": 1.31,
  //   "windSpeed": 0.81
  // };

  weatherCode: { [key: number]: { text: string, icon: string, background: string } } = {
    1000: {
      text: "Soleado",
      icon: "fa-regular fa-sun",
      background: "yellow"
    },
    1100: {
      text: "Mayormente soleado",
      icon: "fa-solid fa-cloud-sun",
      background: "yellow"
    },
    1101: {
      text: "Parcialmente nublado",
      icon: "fa-solid fa-cloud-sun",
      background: "yellow"
    },
    1102: {
      text: "Mayormente nublado",
      icon: "fa-solid fa-cloud-sun",
      background: "yellow"
    },
    1001: {
      text: "Nublado",
      icon: "fa-solid fa-cloud",
      background: "yellow"
    },
    2000: {
      text: "Niebla",
      icon: "fa-solid fa-smog",
      background: "yellow"
    },
    2100: {
      text: "Niebla ligera",
      icon: "fa-solid fa-smog",
      background: "yellow"
    },
    4000: {
      text: "Llovizna",
      icon: "fa-solid fa-cloud-rain",
      background: "yellow"
    },
    4001: {
      text: "Lluvia",
      icon: "fa-solid fa-cloud-showers-heavy",
      background: "yellow"
    },
    4200: {
      text: "Lluvia ligera",
      icon: "fa-solid fa-cloud-rain",
      background: "yellow"
    },
    4201: {
      text: "Fuertes lluvias",
      icon: "fa-solid fa-cloud-showers-water",
      background: "yellow"
    },
    5000: {
      text: "Nieve",
      icon: "fa-regular fa-snowflake",
      background: "yellow"
    },
    5001: {
      text: "Nieve intensa",
      icon: "fa-regular fa-snowflake",
      background: "yellow"
    },
    5100: {
      text: "Nieve ligera",
      icon: "fa-regular fa-snowflake",
      background: "yellow"
    },
    5101: {
      text: "Nieve intensa",
      icon: "fa-regular fa-snowflake",
      background: "yellow"
    },
    6000: {
      text: "Llovizna helada",
      icon: "fa-solid fa-cloud-rain",
      background: "yellow"
    },
    6001: {
      text: "Lluvia helada",
      icon: "fa-solid fa-cloud-showers-heavy",
      background: "yellow"
    },
    6200: {
      text: "Lluvia ligera y helada",
      icon: "fa-solid fa-cloud-rain",
      background: "yellow"
    },
    6201: {
      text: "Fuerte lluvia helada",
      icon: "fa-solid fa-cloud-showers-water",
      background: "yellow"
    },
    7000: {
      text: "Pellets de hielo",
      icon: "fa-regular fa-snowflake",
      background: "yellow"
    },
    7101: {
      text: "Películas de hielo pesadas",
      icon: "fa-regular fa-snowflake",
      background: "yellow"
    },
    7102: {
      text: "Películas de hielo ligeras",
      icon: "fa-regular fa-snowflake",
      background: "yellow"
    },
    8000: {
      text: "Tormenta",
      icon: "fa-solid fa-cloud-bolt",
      background: "yellow"
    }
  }

  statusSystem: boolean = true;
  showLoader: boolean = true;
  assetId: string | null = '';
  assetData!: entity.DataDetailAsset;
  addressPlace: string = '';
  timeZonePlace!: Date;
  timeZoneOffset: any;

  // Registro 31
  objTest: any = {
    "id": "a7602504-2560-4307-b6c4-2893d498ced0",
    "siteName": "Chedraui, Comalcalco",
    "systemSize": null,
    "direction": null,
    "longitude": -93.2185631881877,
    "contractType": "PPA",
    "installationType": "PV",
    "commissionDate": "10/01/2023",
    "clientId": null,
    "inverterQty": 0,
    "netZero": false,
    "assetStatus": "Active",
    "latitude": 18.2673348791128,
    "link": "https://maps.app.goo.gl/fbsLiBkFTsA1HH7R6",
    "plantCode": "NE=33749805",
    "inverterBrand": []
}

  dataRespoSystem!: entity.DataResponseSystem;

  public loadingWeatherData: boolean = true;
  public loadinGtimeZonePlace: boolean = true;
  public loadinSystemSize: boolean = true;

  constructor(
    private assetsService: AssetsService,
    private notificationService: OpenModalsService,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      let id = params.get('assetId');
      if (id) this.getDetailsAsset(id);
    });

    console.log('this.weatherData 1', this.weatherData);
  }

  getDetailsAsset(id: string) {
    this.assetsService.getDetailAsset(id).subscribe({
      next: (response: entity.DataDetailAsset) => {
        console.log('response:', response);
        
        // if (response.plantCode) this.getDataRespSystem({ brand : response.inverterBrand[0], plantCode : response.plantCode })
        if (this.objTest.plantCode) this.getDataRespSystem({ brand: this.objTest.inverterBrand[0], plantCode: this.objTest.plantCode })
        this.assetData = response;
        this.loadingWeatherData = false;
        this.getWeather(this.assetData.latitude, this.assetData.longitude);
        this.getPlaceAddress(this.assetData.latitude, this.assetData.longitude);
        this.getLocalTimeOfPlace(this.assetData.latitude, this.assetData.longitude);
        this.showLoader = false;
      },
      error: (error) => {
        this.showLoader = false;
        this.notificationService.notificacion(`Hable con el administrador.`, 'alert')
        console.error(error)
      }
    });
  }

  getDataRespSystem(objBody: entity.PostDataByPlant) {
    this.assetsService.getDataSystem(objBody).subscribe({
      next: (response: entity.ResponseSystem) => {
        this.dataRespoSystem = response.data
        console.log('dataRespoSystem', this.dataRespoSystem);
      },
      error: (error) => {
        this.notificationService.notificacion(`Ha ocurrido un error, por favor intenta más tarde.`, 'alert')
        console.error(error)
      }
    })
  }

  getWeather(lat: number, long: number) {
    this.assetsService.getWeatherData(lat, long).subscribe((resp: any) => {
      this.weatherData = resp.data.values;
      console.log('this.weatherData 2', this.weatherData);
    });
  }

  getPlaceAddress(lat: number, long: number) {
    this.assetsService.getPlaceAddress(lat, long).subscribe((resp: any) => {
      this.addressPlace = resp.results[0].formatted_address;
    });
  }

  getLocalTimeOfPlace(lat: number, long: number) {
    this.assetsService.getLocalTimeOfPlace(lat, long).subscribe((resp: any) => {
      this.timeZoneOffset = resp.rawOffset + resp.dstOffset;
      this.getTimeLocal()
    }, err => {
      this.notificationService.notificacion(`Ha ocurrido un error, por favor intenta más tarde.`, 'alert')
    });
  }

  getTimeLocal() {
    this.assetsService.obtenerHoraLocal().pipe(takeUntil(this.onDestroy)).subscribe(hora => {
      this.timeZonePlace = new Date(hora + this.timeZoneOffset);
    });
  }

  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.unsubscribe();
  }
}
