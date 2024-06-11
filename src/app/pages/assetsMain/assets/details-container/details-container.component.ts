import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
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

  assetData!: entity.DataPlant;
  dataRespoSystem!: entity.DataResponseSystem;

  assetId: string | null = '';
  addressPlace: string = '';
  timeZonePlace: string = '';
  modalMessage: string[] = [];

  showNotdata: boolean = false;
  showOverviewSite: boolean = false;
  showLoader: boolean = true;
  loadingWeather: boolean = true;
  loadingTimeZone: boolean = true;
  loadingSystem: boolean = true;

  constructor(
    private assetsService: AssetsService,
    private notificationService: OpenModalsService,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.showLoader = false;

    this.route.paramMap.subscribe(params => {
      let id = params.get('assetId');
      if (id) this.getDetailsAsset(id);
    });
  }

  getDetailsAsset(id: string) {
    this.assetsService.getDataId(id).subscribe({
      next: (response: entity.DataPlant) => {
        console.log('información:', response);
        this.assetData = response;
        this.verifyInformation(response);
      },
      error: (error) => {
        this.showLoader = false;
        this.notificationService.notificacion(`Hable con el administrador.`, 'alert')
        console.error(error)
      }
    });
  }

  verifyInformation(assetData: entity.DataPlant) {
    if (assetData?.plantCode && assetData?.inverterBrand[0] == 'Huawei') {
      this.showNotdata = false
      this.getDataRespSystem({ brand: assetData.inverterBrand[0], plantCode: assetData.plantCode })
    } else {
      this.showNotdata = true;
      if (assetData?.inverterBrand[0] != 'Huawei') this.modalMessage.push('La información proporcionada incluye una marca del inversor que aún no ha sido implementado.');
      else this.modalMessage.push('La información no incluye el código de planta o la marca del inversor.');
      this.loadingSystem = false;
    }

    if (assetData.latitude != null && assetData.longitude != null) {
      this.getWeather(assetData.latitude, assetData.longitude);
      this.getPlaceAddress(assetData.latitude, assetData.longitude);
      this.getLocalTimeOfPlace(assetData.latitude, assetData.longitude);
    } else {
      this.loadingWeather = this.loadingTimeZone = false;
      this.modalMessage.push('La información proporcionada no incluye coordenadas de latitud o longitud, por lo que no es posible cargar el mapa.')
    }

    if (this.modalMessage.length) {
      const formattedMessages = this.modalMessage.map(message => `(${'\u2022'}) ${message}`).map(message => `<div>${message}</div>`).join('\n');
      this.notificationService.notificacion(formattedMessages, 'alert');
    }

    this.loadingSystem = false;
  }

  getDataRespSystem(objBody: entity.PostDataByPlant) {
    this.assetsService.getDataSystem(objBody).subscribe({
      next: (response: entity.ResponseSystem) => { this.dataRespoSystem = response.data },
      error: (error) => {
        this.loadingSystem = false;
        this.notificationService.notificacion(`Hable con el administrador.`, 'alert')
        console.error(error)
      }
    })
  }

  getWeather(lat: number, long: number) {
    this.assetsService.getWeatherData(lat, long).subscribe({
      next: (response) => {
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
    this.assetsService.getPlaceAddress(lat, long).subscribe({
      next: (response) => {
        if (response.results.length) {
          this.addressPlace = response.results[0].formatted_address;
        } else {
          this.notificationService.notificacion(`La dirección no pudo ser cargada correctamente.`, 'alert')
        }
      },
    })
  }

  getLocalTimeOfPlace(lat: number, long: number) {
    this.assetsService.getLocalTimeOfPlace(lat, long).subscribe({
      next: (response: string) => {
        this.timeZonePlace = response;
        this.loadingTimeZone = false;
      },
      error: (error) => {
        this.loadingTimeZone = false;
        this.notificationService.notificacion(`No fue posible obtener la información de la zona horaria.`, 'alert')
        console.error(error)
      }
    })
  }

  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.unsubscribe();
  }
}
