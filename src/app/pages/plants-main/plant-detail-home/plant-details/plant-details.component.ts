import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild, ɵɵtrustConstantResourceUrl } from '@angular/core';
import { Subject } from 'rxjs';
import * as entity from '../../plants-model';
import { PlantsService } from '../../plants.service';
import { OpenModalsService } from '@app/shared/services/openModals.service';
import { ActivatedRoute } from '@angular/router';
import { SitePerformanceComponent } from '../site-performance/site-performance.component';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { notificationData, NotificationServiceData } from '@app/shared/models/general-models';
import { NotificationDataService } from '@app/shared/services/notificationData.service';
import { NotificationService } from '@app/shared/services/notification.service';
import { NOTIFICATION_CONSTANTS } from '@app/core/constants/notification-constants';
import { NotificationComponent } from '@app/shared/components/notification/notification.component';
import { MatDialog } from '@angular/material/dialog';

import { EncryptionService } from '@app/shared/services/encryption.service';
import { UserInfo } from '@app/shared/models/general-models';

@Component({
  selector: 'app-plant-detail',
  templateUrl: './plant-details.component.html',
  styleUrl: './plant-details.component.scss'
})
export class PlantsDetailComponent implements OnInit, OnDestroy, AfterViewInit {
  private onDestroy$ = new Subject<void>();

  @ViewChild(SitePerformanceComponent) sitePerformanceComponent!: SitePerformanceComponent;

  userInfo!: UserInfo;
  

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

  data:any = [
    {
      icon : '../../../../../assets/icons/plantType.svg',
      title: 'Plant type',
      description: 'N/A',
    },
    {
      icon : '../../../../../assets/icons/moutingTech.svg',
      title: 'Mounting technology',
      description: 'N/A',
    },
    {
      icon : '../../../../../assets/icons/noOfSite.svg',
      title: 'No of sites',
      description: 'N/A',
    },
    {
      icon : '../../../../../assets/icons/plantTimeZone.svg',
      title: 'Plant time zone',
      description: 'N/A',
    },
    {
      icon : '../../../../../assets/icons/currency.svg',
      title: 'Currency',
      description: 'N/A',
    },
    {
      icon : '../../../../../assets/icons/comssionDate.svg',
      title: 'Commission date',
      description: 'N/A',
    },
    {
      icon : '../../../../../assets/icons/tariff.svg',
      title: 'Tariff',
      description: 'N/A',
    },
    {
      icon : '../../../../../assets/icons/ficed.svg',
      title: 'Ficed tilt anglee',
      description: 'N/A',
    },
  ]
  
  dataTwo:any = [
    {
      icon : '../../../../../assets/icons/epc.svg',
      title: 'EPC',
      description: 'N/A',
    },
    {
      icon : '../../../../../assets/icons/oym.svg',
      title: 'O&M',
      description: 'N/A',
    },
  ]
  
  dataThree:any = [
    {
      icon : '../../../../../assets/icons/transformer.svg',
      title: 'Transformer',
      description: 'N/A',
      titleTwo: 'Generic',
      descriptionTwo: 'N/A',
    },
    {
      icon : '../../../../../assets/icons/inverter.svg',
      title: 'Inverter',
      description: 'N/A',
      titleTwo: 'Solis Solis-60K-LV-5G',
      descriptionTwo: 'N/A',
    },
    {
      icon : '../../../../../assets/icons/pvmodule.svg',
      title: 'PV Module',
      description: 'N/A',
      titleTwo: 'Trina Sola',
      descriptionTwo: 'N/A',
      descriptionThree: 'Mono Crystalline Silicon',
    },
  ]

  plantData!: entity.DataPlant;
  dataRespoSystem!: entity.DataResponseSystem;

  plantId: string | null = '';
  addressPlace: string = '';
  timeZonePlace: string = '';

  modalMessage: string[] = [];

  showNotdata: boolean = false;
  showOverviewSite: boolean = false;
  loadingWeather: boolean = true;
  loadingTimeZone: boolean = true;
  loadingSystem: boolean = true;
  inverterSystemStatus: boolean = false;

  ERROR = NOTIFICATION_CONSTANTS.ERROR_TYPE;


  //banderas de carga para endpoints 
  isLoadingPD= true;  //LOADING PARA PLANT DATA, INFORMACION DE LA CABECERA DE PLANT DATA 
  isLoadingWD = true; //LOADING PARA WHEATER DATA
  isLoadingTZ = true; // LOADING PARA TIME ZONE PLACE
  constructor(
    private plantsService: PlantsService,
    private notificationService: OpenModalsService,
    private route: ActivatedRoute,
    private notificationDataService: NotificationDataService,
    private encryptionService: EncryptionService,
    private notificationsService: NotificationService,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      params.get('id') && this.getPlantDetailsById(params.get('id')!);
    });

    this.loadUserInfo()
  }

  ngAfterViewInit() {
    if (this.sitePerformanceComponent && 
       this.sitePerformanceComponent.plantData) this.sitePerformanceComponent.refreshChart();
  }

  onTabChange(event: MatTabChangeEvent) {
    this.sitePerformanceComponent.refreshChart(event.index);
  }

  getPlantDetailsById(id: string) {
    this.plantsService.getDataById(id).subscribe({
      next: (response: entity.DataPlant) => {
        this.isLoadingPD = false;
        this.plantData = response;
        this.verifyInformation(response);
      },
      error: (error) => {
        this.isLoadingPD = false;
        let errorArray = error.error.errors.errors;
        if(errorArray.length == 1){
          this.createNotificationError(this.ERROR, errorArray[0].title,errorArray[0].descripcion,errorArray[0].warn)
          }
        console.error(error)
      }
    });
  }

  verifyInformation(plantData: entity.DataPlant) {
    if (plantData?.plantCode && plantData?.inverterBrand[0] == 'Huawei') {
      this.showNotdata = false
      this.getDataRespSystem({ brand: "Huawei", plantCode: plantData.plantCode })
    } else {
      this.showNotdata = true;
      if (plantData?.plantCode && plantData?.inverterBrand[0] != 'Huawei') this.modalMessage.push('The information provided includes an inverter brand that has not yet been implemented.');
      else this.modalMessage.push('Information does not include plant code or inverter brand.');
      this.loadingSystem = false;
    }

    if (plantData.latitude != null && plantData.longitude != null) {
      this.getWeather(plantData.latitude, plantData.longitude);
      this.getPlaceAddress(plantData.latitude, plantData.longitude);
      this.getLocalTimeOfPlace(plantData.latitude, plantData.longitude);
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

  getDataRespSystem(postData: entity.PostDataByPlant) {
    this.plantsService.getDataSystem(postData).subscribe({
      next: (response: entity.ResponseSystem) => this.dataRespoSystem = response?.data,
      error: (error) => {
        this.loadingSystem = false;
        this.notificationService.notificacion(`Talk to the administrator.`, 'alert')
        console.error(error)
      }
    })
  }

  getWeather(lat: number, long: number) {
    this.plantsService.getWeatherData(lat, long).subscribe({
      next: (response) => {
        this.isLoadingWD = false;
        this.loadingWeather = false;
        this.weatherData = response.data.values;
      },
      error: (error) => {
        this.isLoadingWD = false;
        this.loadingWeather = false;
        this.createNotificationError(NOTIFICATION_CONSTANTS.ERROR_TITLE_WEATHER_DATA,NOTIFICATION_CONSTANTS.ERROR_CONTENT_WEATHER_DATA)
        console.error(error)
      }
    })
  }

  getPlaceAddress(lat: number, long: number) {
    this.plantsService.getPlaceAddress(lat, long).subscribe({
      next: (response) => {
        if (response.results.length) this.addressPlace = response.results[0].formatted_address;
        else this.notificationService.notificacion(`The address could not be loaded correctly.`, 'alert')
      },
    })
  }

  getLocalTimeOfPlace(lat: number, long: number) {
    this.plantsService.getLocalTimeOfPlace(lat, long).subscribe({
      next: (response: string) => {
        this.timeZonePlace = response;
        this.isLoadingTZ = false; 
        this.loadingTimeZone = false;
      },
      error: (error) => {
        this.loadingTimeZone = false;
        this.isLoadingTZ = false; 
        this.createNotificationError(NOTIFICATION_CONSTANTS.ERROR_TITLE_TIME_ZONE,NOTIFICATION_CONSTANTS.ERROR_CONTENT_TIME_ZONE)
        console.error(error)
      }
    })
  }

  loadUserInfo() {
    const encryptedData = localStorage.getItem('userInfo');
    if (encryptedData) this.userInfo = this.encryptionService.decryptData(encryptedData);
  }

  systemStatus(status: boolean) {
    this.inverterSystemStatus = status;
  }

  createNotificationError(notificationType:string, title?:string, description?: string, warn?:string ){
    const dataNotificationModal:notificationData|undefined = this.notificationDataService.uniqueError();
    dataNotificationModal!.title= title;
    dataNotificationModal!.content = description;
    dataNotificationModal!.warn = warn; // ESTOS PARAMETROS SE IGUALAN AQUI DEBIDO A QUE DEPENDEN DE LA RESPUESTA DEL ENDPOINT
    const encryptedData = localStorage.getItem('userInfo');
    if (encryptedData) {
      const userInfo = this.encryptionService.decryptData(encryptedData);
      let dataNotificationService:NotificationServiceData= { //INFORMACION NECESARIA PARA DAR DE ALTA UNA NOTIFICACION EN SISTEMA
        userId:userInfo.id,
        descripcion:description,
        notificationTypeId:dataNotificationModal?.typeId,
        notificationStatusId:this.notificationsService.getNotificationStatusByName(NOTIFICATION_CONSTANTS.COMPLETED_STATUS).id //EL STATUS ES COMPLETED DEBIDO A QUE EN UN ERROR NO ESPERAMOS UNA CONFIRMACION O CANCELACION(COMO PUEDE SER EN UN ADD, EDIT O DELETE)
      } 
      this.notificationsService.createNotification(dataNotificationService).subscribe(res=>{
      })
    }

    

    const dialogRef = this.dialog.open(NotificationComponent, {
      width: '540px',     
      data: dataNotificationModal
    });

  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.unsubscribe();
  }
}
