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

  assetData!: entity.DataDetailAsset;
  dataRespoSystem!: entity.DataResponseSystem;


  assetId: string | null = '';
  addressPlace: string = '';
  timeZonePlace: string = '';
  modalMessage: string[] = [];

  showLoader: boolean = true;
  loadingWeather: boolean = true;
  loadingTimeZone: boolean = true;
  loadingSystem: boolean = true;



  constructor(
    private assetsService: AssetsService,
    private notificationService: OpenModalsService,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      let id = params.get('assetId');
      if (id) this.getDetailsAsset(id);
    });
  }

  getDetailsAsset(id: string) {
    this.assetsService.getDetailAsset(id).subscribe({
      next: (response: entity.DataDetailAsset) => {
        console.log('response:', response);
        this.assetData = response;

        if (this.assetData?.plantCode && this.assetData?.inverterBrand?.length < 1) this.getDataRespSystem({ brand: this.assetData.inverterBrand[0], plantCode: this.assetData.plantCode })
        else {
          this.loadingSystem = false
          this.modalMessage.push('La información no incluye el código de planta o la marca del inversor.')
        }

          if (this.assetData.latitude != null && this.assetData.longitude != null) {
          this.getWeather(this.assetData.latitude, this.assetData.longitude);
          this.getPlaceAddress(this.assetData.latitude, this.assetData.longitude);
          this.getLocalTimeOfPlace(this.assetData.latitude, this.assetData.longitude);
        } else {
          this.loadingWeather = this.loadingTimeZone = false;
          this.modalMessage.push('La información no incluye coordenadas de latitud o longitud.')
        }

        this.showLoader = false;
        
        if (this.modalMessage.length) {
          const formattedMessages = this.modalMessage.map(message => `(${'\u2022'}) ${message}`).map(message => `<div>${message}</div>`).join('\n');
          this.notificationService.notificacion(formattedMessages, 'alert');
        }
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
        this.loadingSystem = false;
      },
      error: (error) => {
        this.loadingSystem = false;
        this.notificationService.notificacion(`Hable con el administrador.`, 'alert')
        console.error(error)
      }
    })
  }

  getWeather(lat: number, long: number) {
    this.assetsService.getWeatherData(lat, long).subscribe({
      next: (response: any) => {
        this.loadingWeather = false;
        this.weatherData = response.data.values;
      },
      error: (error) => {
        this.loadingWeather = false;
        this.notificationService.notificacion(`Hable con el administrador.`, 'alert')
        console.error(error)
      }
    })
  }

  getPlaceAddress(lat: number, long: number) {
    this.assetsService.getPlaceAddress(lat, long).subscribe((resp: any) => {
      this.addressPlace = resp.results[0].formatted_address;
    });
  }

  getLocalTimeOfPlace(lat: number, long: number) {
    this.assetsService.getLocalTimeOfPlace(lat, long).subscribe({
      next: (response: string) => {
        this.timeZonePlace = response;
        this.loadingTimeZone = false;
      },
      error: (error) => {
        this.loadingTimeZone = false;
        this.notificationService.notificacion(`No se pudo obtener la información de la zona horaria.`, 'alert')
        console.error(error)
      }
    })
  }

  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.unsubscribe();
  }
}
