import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { provideNativeDateAdapter } from '@angular/material/core';
import { ViewEncapsulation } from '@angular/core';
import { SharedComponensModule } from '@app/shared/components/shared-components.module';
import { Observable, Subject } from 'rxjs';
import { MaterialModule } from '@app/shared/material/material.module';
import * as entity from './home-model';
import { Router } from '@angular/router';
import { HomeService } from './home.service';
import { CommonModule } from '@angular/common';
import { MatSort } from '@angular/material/sort';
import { MessageNoDataComponent } from '@app/shared/components/message-no-data/message-no-data.component';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { Chart, ChartConfiguration, ChartOptions, registerables } from "chart.js";
import moment from 'moment';
import { BaseChartDirective, NgChartsModule } from 'ng2-charts';
import { FormatsService } from '@app/shared/services/formats.service';
import { GeneralFilters, GeneralResponse, notificationData, NotificationServiceData, UserInfo } from '@app/shared/models/general-models';
import { Store } from '@ngrx/store';
import { EncryptionService } from '@app/shared/services/encryption.service';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { NotificationService } from '@app/shared/services/notification.service';
import { NotificationDataService } from '@app/shared/services/notificationData.service';
import { NOTIFICATION_CONSTANTS } from '@app/core/constants/notification-constants';
import { NotificationComponent } from '@app/shared/components/notification/notification.component';
import { MatDialog } from '@angular/material/dialog';



Chart.register(...registerables);
@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    imports: [
        CommonModule,
        SharedComponensModule,
        MaterialModule,
        ReactiveFormsModule,
        NgChartsModule,
        NgxSkeletonLoaderModule
    ],
    standalone:true,
    styleUrl: './home.component.scss',
    providers: [provideNativeDateAdapter()],
    encapsulation: ViewEncapsulation.None
})
export class HomeComponent implements OnInit, OnDestroy {
  ERROR = NOTIFICATION_CONSTANTS.ERROR_TYPE;

  private onDestroy$ = new Subject<void>();

  generalFilters$!: Observable<GeneralFilters>;

  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;

  months: entity.Months[] = [
    { value: '01', viewValue: 'January' },
    { value: '02', viewValue: 'February' },
    { value: '03', viewValue: 'March' },
    { value: '04', viewValue: 'April' },
    { value: '05', viewValue: 'May' },
    { value: '06', viewValue: 'June' },
    { value: '07', viewValue: 'July' },
    { value: '08', viewValue: 'August' },
    { value: '09', viewValue: 'September' },
    { value: '10', viewValue: 'October' },
    { value: '11', viewValue: 'November' },
    { value: '12', viewValue: 'December' }
  ];

  labels: entity.Labels[] = [
    { text: 'CFE Subtotal (MXN)', color: 'rgba(121, 36, 48, 1)' },
    { text: 'Energía Real Subtotal (MXN)', color: 'rgba(238, 84, 39, 1)' },
    { text: 'Economic Savings (MXN)', color: 'rgba(87, 177, 177, 1)' },
    { text: 'Expenses without Energía Real (MXN)', color: 'rgba(239, 68, 68, 1)' },

  ];

  lineChartDataES!: ChartConfiguration<'bar' | 'line'>['data'];

  lineChartOptionsES: ChartOptions<'bar' | 'line'> = {
    responsive: true,
    layout: {
      padding: {
        left: 0,
        right: 200,
      },
    },


    plugins: {
      legend: {
        display: false
      }
    },

    scales: {
      x: {
        type: 'category',
        stacked: true,
        grid: {
          display: false,

        },
      },
      y: {

        stacked: true,
        grid: {
          display: true,
        },
      },

    },
    backgroundColor: 'rgba(242, 46, 46, 1)',
  };

  displayChartES: boolean = false;
  chartES: any;

  dataSource = new MatTableDataSource<any>([]);
  data: number[] = [5, 4, 3]
  displayedColumns: string[] = [
    'siteName',
    'energyConsumption',
    'energyProduction',
    'solarCoverage',
    'co2Saving',
    'siteStatus'
  ];

  lineChartData!: ChartConfiguration<'bar'>['data'];
  lineChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    animation: {
      onComplete: () => {},
      delay: (context) => {
        let delay = 0;
        if (context.type === 'data' && context.mode === 'default') {
          delay = context.dataIndex * 300 + context.datasetIndex * 100;
        }
        return delay;
      },
    },
    plugins: {
      tooltip: {
        usePointStyle: true,
        callbacks: {
          label: function (context) {
            const value = Math.abs(context.raw as number).toLocaleString('en-US');
            return `${context.dataset.label}: ${value}`;
          },
        },
      },
      legend: {
        labels: {
          usePointStyle: true,
        },
        position: 'bottom',
        onHover: (event, legendItem, legend) => {
          const index = legendItem.datasetIndex;
          const chart = legend.chart;
  
          chart.data.datasets.forEach((dataset, i) => {
            dataset.backgroundColor = i === index ? dataset.backgroundColor : 'rgba(200, 200, 200, 0.5)';
          });
  
          chart.update();
        },
        onLeave: (event, legendItem, legend) => {
          const chart = legend.chart;
  
          chart.data.datasets.forEach((dataset, i) => {
            dataset.backgroundColor = i === 0 ? 'rgba(121, 36, 48, 1)' : 'rgba(87, 177, 177, 1)';
          });
  
          chart.update();
        },
      },
    },
  
    scales: {
      x: {
        stacked: false,
        grid: {
          display: false,
        },
      },
      y: {
        ticks: {
          callback: function (value, index, values) {
            
            const numericValue = typeof value === 'number' ? value : parseFloat(value as string);
  
            if (!isNaN(numericValue)) {
              const gwhValue = numericValue / 1_000_000; 
              return `${gwhValue.toLocaleString('en-US')} GWh`;
            }
            return '';
          },
        },
        stacked: false,
        grid: {
          display: false,
        },
      },
    },
    backgroundColor: 'rgba(242, 46, 46, 1)',
  };
  
  selection = new SelectionModel<entity.PeriodicElement>(true, []);

  currentYear = new Date().getFullYear();

  selectedEndMonth: number = new Date().getMonth() + 1;

  solarCoverage: string = '';

  dayOrMount = new FormControl('month');

  showLoader: boolean = true;

  selectedMonths: any[] = [];
  dataTooltipsInfo: entity.statesResumeTooltip[] = [];

  co2Saving!: entity.Co2SavingResponse;
  savingsDetails!: entity.SDResponse;
  economicSavingsData!: entity.EconomicSavings

  userInfo!: UserInfo;

  co2Progress: string = '25%'

  statesColors: any = {};

  tooltipsInfo: entity.statesResumeTooltip[] = [];

  isLoadingSDWidget: boolean = true;  //loading saving details

  isLoadingSCWidget: boolean = true; //loading solar coverage

  isLoadingCO2Widget: boolean = true; //loading co2Widget

  isLoadingESWidget: boolean = true; //loading economic savings  

  isLoadingECWidget: boolean = true; //loading energy consumption  

  isLoadingMapa: boolean = true;

  formFilters = this.formBuilder.group({
    rangeDateStart: [{ value: '', disabled: false }],
    rangeDateEnd: [{ value: '', disabled: false }]
  });

  constructor(
    private moduleServices: HomeService,
    private router: Router,
    private formBuilder: FormBuilder,
    private formatsService: FormatsService,
    private encryptionService: EncryptionService,
    private store: Store<{ filters: GeneralFilters }>,
    private notificationsService: NotificationService,
    private notificationDataService: NotificationDataService,
    private dialog: MatDialog,
  ) {
    this.generalFilters$ = this.store.select(state => state.filters);
  }

  ngOnInit(): void {
    this.getUserClient();
    this.initiLineChartData();
    this.initiLineChartDataES();
  }

  initiLineChartDataES() {
    this.lineChartDataES = {
      labels: [''],
      datasets: [
        {
          type: 'bar',
          data: [this.economicSavingsData.cfeSubtotal],
          label: 'CFE Subtotal (MXN)',
          backgroundColor: 'rgba(121, 36, 48, 1)',
          maxBarThickness: 112,
        },
        {
          type: 'bar',
          data: [this.economicSavingsData.energiaRealSubtotal],
          label: 'Energía Real Subtotal (MXN)',
          backgroundColor: 'rgba(238, 84, 39, 1)',
          maxBarThickness: 112,
        },
        {
          type: 'bar',
          data: [this.economicSavingsData.economicSaving],
          label: 'Economic Savings (MXN)',
          backgroundColor: 'rgba(87, 177, 177, 1)',
          order: 2,
          maxBarThickness: 112,
        },
        {
          type: 'line',
          data: [this.economicSavingsData.expensesWithoutEnergiaReal],
          label: 'Expenses without Energía Real (MXN)',
          backgroundColor: 'rgba(239, 68, 68, 1)',
          borderColor: 'rgba(239, 68, 68, 1)',
          pointBackgroundColor: 'rgba(239, 68, 68, 1)',
          pointBorderColor: 'rgba(239, 68, 68, 1)',
          pointRadius: 8,
          order: 1
        }
      ]
    };
  }

  initiLineChartData() {
    this.lineChartData = {
      labels: this.labels,
      datasets: [
        {
          data: [],
          label: 'Energy Production',
          backgroundColor: 'rgba(121, 36, 48, 1)',
        },
        {
          data: [],
          label: 'Energy Consumption',
          backgroundColor: 'rgba(87, 177, 177, 1)',
        }
      ]
    };
  }

  getUserClient() {
    const encryptedData = localStorage.getItem('userInfo');
    if (encryptedData) {
      const userInfo = this.encryptionService.decryptData(encryptedData);

      if (!userInfo.clientes[0]?.length) {
        this.alertInformationModal()
      } else {

        this.generalFilters$.subscribe((generalFilters: GeneralFilters) => {
          this.isLoadingSDWidget = true;  //loading saving details

          this.isLoadingSCWidget = true; //loading solar coverage

          this.isLoadingCO2Widget = true; //loading co2Widget

          this.isLoadingESWidget = true; //loading economic savings  

          this.isLoadingECWidget = true; //loading energy consumption  

          this.isLoadingMapa = true;

          this.getTooltipInfo({ ...generalFilters, clientId: userInfo.clientes[0] });
          this.getDataClients({ ...generalFilters, clientId: userInfo.clientes[0] });
          this.getDataSavingDetails({ ...generalFilters, clientId: userInfo?.clientes[0] });
          this.getDataSolarCoverga({ ...generalFilters, clientId: userInfo?.clientes[0] });
          this.getEconomicSavings({ ...generalFilters, clientId: userInfo?.clientes[0] });
          this.getCo2Saving({ ...generalFilters, clientId: userInfo?.clientes[0] });
        });
      }
    }
  }

  getTooltipInfo(filters: GeneralFilters) {
    this.moduleServices.getDataStates(filters).subscribe({
      next: (response: GeneralResponse<entity.MapStatesResponse>) => {
        response.response?.kwhByStateResponse?.forEach((state) => {
          let color: string = "#FFFFFF";
          if (state.totalInstalledCapacity > 0 && state.totalInstalledCapacity <= 1500) color = "#9AE3E1"
          else if (state.totalInstalledCapacity > 1500 && state.totalInstalledCapacity <= 3000) color = "#64E2E2"
          else if (state.totalInstalledCapacity > 3000 && state.totalInstalledCapacity <= 4500) color = "#00E5FF"
          else if (state.totalInstalledCapacity > 4500 && state.totalInstalledCapacity <= 6000) color = "#08C4DA"
          else if (state.totalInstalledCapacity > 6000) color = "#008796"
          this.statesColors[state.state] = {
            color: color,
          };
        });

        if (response?.response?.kwhByStateResponse) {
          this.tooltipsInfo = response.response.kwhByStateResponse;
        }

        this.isLoadingMapa = false;
        //this.createTooltips();
      },
      error: (error) => {
        this.isLoadingMapa = false;
        let errorArray = error!.error!.errors!.errors!;
        if (errorArray && errorArray.length === 1) {
          this.createNotificationError(this.ERROR, errorArray[0].title, errorArray[0].descripcion, errorArray[0].warn)
        }
      }
    });
  }

  getDataSavingDetails(filters: GeneralFilters) {
    this.moduleServices.getDataSavingDetails(filters).subscribe({
      next: (response: entity.SDResponse) => {
        this.savingsDetails = response;
        this.isLoadingSDWidget = false;
      },
      error: (error) => {
        this.isLoadingSDWidget = false;
        let errorArray = error!.error!.errors!.errors!;
        if (errorArray && errorArray.length === 1) {
          this.createNotificationError(this.ERROR, errorArray[0].title, errorArray[0].descripcion, errorArray[0].warn)
        }
      }
    })
  }

  getCo2Saving(filters: GeneralFilters) {
    this.moduleServices.getCo2Saving(filters).subscribe({
      next: (response: entity.Co2SavingResponse) => {
        this.isLoadingCO2Widget = false;
        this.co2Saving = response;
      },
      error: (error) => {
        this.isLoadingCO2Widget = false;
        let errorArray = error!.error!.errors!.errors!;
        if (errorArray && errorArray.length === 1) {
          this.createNotificationError(this.ERROR, errorArray[0].title, errorArray[0].descripcion, errorArray[0].warn)
        }
      }
    })
  }

  getDataClients(filters: GeneralFilters) {
    this.moduleServices.getDataClients(filters).subscribe({
      next: (response: entity.DataRespSavingDetailsMapper) => {
        let data =this.mappingData(response.data)
        
        this.lineChartData = {
          labels: data.labels,
          datasets: [
            {
              data: data.energyProduction,
              label: 'Energy Production',
              backgroundColor: 'rgba(121, 36, 48, 1)',
            },
            {
              data: data.energyConsumption,
              label: 'Energy Consumption',
              backgroundColor: 'rgba(87, 177, 177, 1)',
            }
          ]
        };
        this.isLoadingECWidget = false;
        this.dataSource.data = response.data;
        this.dataSource.sort = this.sort;
        this.selection.clear();
      },
      error: (error) => {
        this.isLoadingECWidget = false;
        let errorArray = error!.error!.errors!.errors!;
        if (errorArray && errorArray.length === 1) {
          this.createNotificationError(this.ERROR, errorArray[0].title, errorArray[0].descripcion, errorArray[0].warn)
        }
      }
    })
  }

  getDataSolarCoverga(filters: GeneralFilters) {
    this.moduleServices.getDataSolarCoverage(filters).subscribe({
      next: (response: string) => {
        this.isLoadingSCWidget = false;
        this.solarCoverage = response;
      },
      error: (error) => {
        this.isLoadingSCWidget = false;
        let errorArray = error!.error!.errors!.errors!;
        if (errorArray && errorArray.length === 1) {
          this.createNotificationError(this.ERROR, errorArray[0].title, errorArray[0].descripcion, errorArray[0].warn)
        }
      }
    })
  }

  mappingData(dataSelected: any[]): any {
    let labels = dataSelected.map(item => item.siteName);
    let energyConsumption = dataSelected.map(item => this.formatsService.homeGraphFormat(item.energyConsumption));
    let energyProduction = dataSelected.map(item => this.formatsService.homeGraphFormat(item.energyProduction));

    return {
      labels: labels,
      energyConsumption: energyConsumption,
      energyProduction: energyProduction
    }
  }

  convertToISO8601(month: string): string {
    const year = new Date().getFullYear();
    return moment(`${year}-${month}-01`).startOf('month').toISOString();
  }

  goDetails(id: string) {
    this.router.navigateByUrl(`er/plants/details/${id}`)
  }

  getEconomicSavings(filters: GeneralFilters) {
    this.moduleServices.getSavings(filters).subscribe({
      next: (response) => {
        this.isLoadingESWidget = false;
        this.lineChartDataES = {
          labels: [''],
          datasets: [
            {
              type: 'bar',
              data: [response.response.cfeSubtotal],
              label: 'CFE Subtotal (MXN)',
              backgroundColor: 'rgba(121, 36, 48, 1)',
              maxBarThickness: 112,
            },
            {
              type: 'bar',
              data: [response.response.energiaRealSubtotal],
              label: 'Energía Real Subtotal (MXN)',
              backgroundColor: 'rgba(238, 84, 39, 1)',
              maxBarThickness: 112,


            },
            {
              type: 'bar',
              data: [response.response.economicSaving],
              label: 'Economic Savings (MXN)',
              backgroundColor: 'rgba(87, 177, 177, 1)',
              order: 2,
              maxBarThickness: 112,

            },
            {
              type: 'line',
              data: [response.response.expensesWithoutEnergiaReal],
              label: 'Expenses Without Energía Real (MXN)',
              backgroundColor: 'rgba(239, 68, 68, 1)',
              borderColor: 'rgba(239, 68, 68, 1)',
              pointBackgroundColor: 'rgba(239, 68, 68, 1)',
              pointBorderColor: 'rgba(239, 68, 68, 1)',
              pointRadius: 8,
              order: 1
            }
          ]
        };
        this.displayChartES = true;
        this.initChartES();
      },
      error: (error) => {
        this.isLoadingESWidget = false;
        let errorArray = error!.error!.errors!.errors!;
        if (errorArray && errorArray.length === 1) {
          this.createNotificationError(this.ERROR, errorArray[0].title, errorArray[0].descripcion, errorArray[0].warn)
        }
      }
    })
  }

  initChartES(): void {
    const ctx = document.getElementById('economicSavingsChart') as HTMLCanvasElement;
    if (ctx) {
      this.chartES = new Chart(ctx, {
        type: 'bar',
        data: this.lineChartDataES,
        options: this.lineChartOptionsES
      });
    }
  }

  createNotificationError(notificationType: string, title?: string, description?: string, warn?: string) {
    const dataNotificationModal: notificationData | undefined = this.notificationDataService.uniqueError();
    dataNotificationModal!.title = title;
    dataNotificationModal!.content = description;
    dataNotificationModal!.warn = warn; // ESTOS PARAMETROS SE IGUALAN AQUI DEBIDO A QUE DEPENDEN DE LA RESPUESTA DEL ENDPOINT
    const encryptedData = localStorage.getItem('userInfo');
    if (encryptedData) {
      const userInfo = this.encryptionService.decryptData(encryptedData);
      let dataNotificationService: NotificationServiceData = { //INFORMACION NECESARIA PARA DAR DE ALTA UNA NOTIFICACION EN SISTEMA
        userId: userInfo.id,
        descripcion: description,
        notificationTypeId: dataNotificationModal?.typeId,
        notificationStatusId: this.notificationsService.getNotificationStatusByName(NOTIFICATION_CONSTANTS.COMPLETED_STATUS).id //EL STATUS ES COMPLETED DEBIDO A QUE EN UN ERROR NO ESPERAMOS UNA CONFIRMACION O CANCELACION(COMO PUEDE SER EN UN ADD, EDIT O DELETE)
      }
      this.notificationsService.createNotification(dataNotificationService).subscribe(res => {
      })
    }

    this.dialog.open(NotificationComponent, {
      width: '540px',
      data: dataNotificationModal
    });
  }

  alertInformationModal() {
    const dataNotificationModal: notificationData = this.notificationDataService.showNoClientIdAlert();

    this.dialog.open(NotificationComponent, {
      width: '540px',
      data: dataNotificationModal
    });
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
