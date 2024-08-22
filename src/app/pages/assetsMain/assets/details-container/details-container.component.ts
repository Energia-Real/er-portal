import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { AssetsService } from '../assets.service';
import { OpenModalsService } from '@app/shared/services/openModals.service';
import * as entity from '../assets-model';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { SitePerformanceComponent } from '../site-performance/site-performance.component';

@Component({
  selector: 'app-details-container',
  templateUrl: './details-container.component.html',
  styleUrl: './details-container.component.scss'
})
export class DetailsContainerComponent implements OnInit, OnDestroy, AfterViewInit{
  private onDestroy = new Subject<void>();

  weatherData: any = null

  weatherCode: { [key: number]: { text: string, icon: string, background: string } } = {
    1000: {
      text: "Sunny",
      icon: "fa-regular fa-sun",
      background: "yellow"
    },
    1100: {
      text: "Mainly sunny",
      icon: "fa-solid fa-cloud-sun",
      background: "yellow"
    },
    1101: {
      text: "Partly cloudy",
      icon: "fa-solid fa-cloud-sun",
      background: "yellow"
    },
    1102: {
      text: "Mostly cloudy",
      icon: "fa-solid fa-cloud-sun",
      background: "yellow"
    },
    1001: {
      text: "Cloudy",
      icon: "fa-solid fa-cloud",
      background: "yellow"
    },
    2000: {
      text: "Fog",
      icon: "fa-solid fa-smog",
      background: "yellow"
    },
    2100: {
      text: "Light fog",
      icon: "fa-solid fa-smog",
      background: "yellow"
    },
    4000: {
      text: "Drizzle",
      icon: "fa-solid fa-cloud-rain",
      background: "yellow"
    },
    4001: {
      text: "Rain",
      icon: "fa-solid fa-cloud-showers-heavy",
      background: "yellow"
    },
    4200: {
      text: "Light rain",
      icon: "fa-solid fa-cloud-rain",
      background: "yellow"
    },
    4201: {
      text: "Strong rains",
      icon: "fa-solid fa-cloud-showers-water",
      background: "yellow"
    },
    5000: {
      text: "Snow",
      icon: "fa-regular fa-snowflake",
      background: "yellow"
    },
    5001: {
      text: "Heavy snow",
      icon: "fa-regular fa-snowflake",
      background: "yellow"
    },
    5100: {
      text: "Light snow",
      icon: "fa-regular fa-snowflake",
      background: "yellow"
    },
    5101: {
      text: "Heavy snow",
      icon: "fa-regular fa-snowflake",
      background: "yellow"
    },
    6000: {
      text: "Freezing drizzle",
      icon: "fa-solid fa-cloud-rain",
      background: "yellow"
    },
    6001: {
      text: "freezing rain",
      icon: "fa-solid fa-cloud-showers-heavy",
      background: "yellow"
    },
    6200: {
      text: "Light and freezing rain",
      icon: "fa-solid fa-cloud-rain",
      background: "yellow"
    },
    6201: {
      text: "Heavy freezing rain",
      icon: "fa-solid fa-cloud-showers-water",
      background: "yellow"
    },
    7000: {
      text: "Ice pellets",
      icon: "fa-regular fa-snowflake",
      background: "yellow"
    },
    7101: {
      text: "Heavy ice films",
      icon: "fa-regular fa-snowflake",
      background: "yellow"
    },
    7102: {
      text: "light ice films",
      icon: "fa-regular fa-snowflake",
      background: "yellow"
    },
    8000: {
      text: "Storm",
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
  
  @ViewChild(SitePerformanceComponent) sitePerformanceComponent!: SitePerformanceComponent;

  ngAfterViewInit() {
    if (this.sitePerformanceComponent && this.sitePerformanceComponent.assetData) {
      this.sitePerformanceComponent.refreshChart();
    }
  }

  onTabChange(event: MatTabChangeEvent) {
    this.sitePerformanceComponent.refreshChart(event.index);
  }

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
        this.assetData = response;
        this.verifyInformation(response);
      },
      error: (error) => {
        this.showLoader = false;
        this.notificationService.notificacion(`Talk to the administrator.`, 'alert')
        console.error(error)
      }
    });
  }

  verifyInformation(assetData: entity.DataPlant) {
    if (assetData?.plantCode && "Huawei" == 'Huawei') {
      this.showNotdata = false
      this.getDataRespSystem({ brand: "Huawei", plantCode: assetData.plantCode })
    } else {
      this.showNotdata = true;
      if ("Huawei" != 'Huawei') this.modalMessage.push('The information provided includes an inverter brand that has not yet been implemented.');
      else this.modalMessage.push('Information does not include plant code or inverter brand.');
      this.loadingSystem = false;
    }

    if (assetData.latitude != null && assetData.longitude != null) {
      this.getWeather(assetData.latitude, assetData.longitude);
      this.getPlaceAddress(assetData.latitude, assetData.longitude);
      this.getLocalTimeOfPlace(assetData.latitude, assetData.longitude);
    } else {
      this.loadingWeather = this.loadingTimeZone = false;
      this.modalMessage.push('The information provided does not include latitude or longitude coordinates, so it is not possible to upload the map.')
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
        this.notificationService.notificacion(`Talk to the administrator.`, 'alert')
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
        this.notificationService.notificacion(`Talk to the administrator.`, 'alert')
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
          this.notificationService.notificacion(`The address could not be loaded correctly.`, 'alert')
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
        this.notificationService.notificacion(`Could not get time zone information.`, 'alert')
        console.error(error)
      }
    })
  }

  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.unsubscribe();
  }
}
