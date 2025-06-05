import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject, takeUntil } from 'rxjs';
import * as entity from '../../plants-model';
import { FormBuilder } from '@angular/forms';
import { Chart, ChartConfiguration, ChartOptions } from "chart.js";
import { OpenModalsService } from '@app/shared/services/openModals.service';
import { PlantsService } from '../../plants.service';
import { GeneralFilters, notificationData, NotificationServiceData } from '@app/shared/models/general-models';
import { Store } from '@ngrx/store';
import { EncryptionService } from '@app/shared/services/encryption.service';
import { MatDialog } from '@angular/material/dialog';
import { NotificationService } from '@app/shared/services/notification.service';
import { NotificationDataService } from '@app/shared/services/notificationData.service';
import { NOTIFICATION_CONSTANTS } from '@app/core/constants/notification-constants';
import { NotificationComponent } from '@app/shared/components/notification/notification.component';
import { TranslationService } from '@app/shared/services/i18n/translation.service';

@Component({
  selector: 'app-site-performance',
  templateUrl: './site-performance.component.html',
  styleUrls: ['./site-performance.component.scss'],
  standalone: false
})
export class SitePerformanceComponent implements OnInit, OnDestroy {
  private onDestroy$ = new Subject<void>();
  @Input() plantData!: entity.DataPlant;
  @Input() notData!: boolean;

  generalFilters$!: Observable<GeneralFilters>;

  chart: any;
  lineChartData!: ChartConfiguration<'bar' | 'line'>['data'];

  lineChartOptions: ChartOptions<'bar' | 'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      onComplete: () => {
      },
      delay: (context) => {
        let delay = 0;
        if (context.type === 'data' && context.mode === 'default') {
          delay = context.dataIndex * 300 + context.datasetIndex * 100;
        }
        return delay;
      },
    },
    layout: {
      padding: {
        left: 10,
        right: 10,
        top: 20,
        bottom: 20
      }
    },
    plugins: {
      tooltip: {
        usePointStyle: true,
        callbacks: {
          label: function (context) {
            const value = Math.abs(context.raw as number).toLocaleString('en-US');
            return `${context.dataset.label}: ${value}`;
          }
        }
      },

      legend: {
        labels: {
          usePointStyle: true,
          padding: 20,
          boxWidth: 10,
          boxHeight: 10
        },
        position: "bottom",

      }
    },

    scales: {
      x: {
        stacked: true,
        grid: {
          display: false,
        },
        ticks: {
          autoSkip: false,
          maxRotation: 45,
          minRotation: 45,
          padding: 10
        }
      },
      y: {
        ticks: {
          callback: function (value, index, values) {
            return `${Number(value).toLocaleString('en-US')} MWh`;
          },
        },
        stacked: true,
        grid: {
          display: false,
        },
      }
    },
    backgroundColor: 'rgba(242, 46, 46, 1)',
  };

  formFilters = this.formBuilder.group({
    start: [{ value: '', disabled: false }],
    end: [{ value: '', disabled: false }],
  });

  displayChart: boolean = false;
  lineChartLegend: boolean = true;
  showSitePerformance: boolean = false;

  projectStatus!: entity.ProjectStatus[];

  dateToday = new Date();

  sitePerformance: entity.DataResponseArraysMapper = {
    primaryElements: [],
    additionalItems: []
  };

  fullLoad: boolean = false;

  ERROR = NOTIFICATION_CONSTANTS.ERROR_TYPE;

  isLoading: boolean = true;

  constructor(
    private formBuilder: FormBuilder,
    private moduleServices: PlantsService,
    private notificationService: OpenModalsService,
    private encryptionService: EncryptionService,
    private store: Store<{ filters: GeneralFilters }>,
    private dialog: MatDialog,
    private notificationsService: NotificationService,
    private notificationDataService: NotificationDataService,
    private translationService: TranslationService
  ) {
    this.generalFilters$ = this.store.select(state => state.filters);
  }

  ngOnInit(): void {
    this.dateToday = new Date(this.dateToday.getFullYear(), 0, 1);
    this.getStatus();
    this.getUserClient();

    // Subscribe to language changes
    this.translationService.currentLang$
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(() => this.getUserClient());
  }

  getUserClient() {
    const encryptedData = localStorage.getItem('userInfo');
    if (encryptedData) {
      const userInfo = this.encryptionService.decryptData(encryptedData);
      this.generalFilters$.subscribe((generalFilters: GeneralFilters) => {
        this.getSitePerformance({ clientId: userInfo.clientes[0], ...generalFilters });
      });
    }
  }

  getSitePerformance(filters: GeneralFilters) {
    this.moduleServices.getSitePerformanceDetails(this.plantData.id, filters).subscribe({
      next: (response: entity.DataResponseArraysMapper | null) => {
        if (response) {
          this.sitePerformance.primaryElements = response.primaryElements;
          this.sitePerformance.additionalItems = response.additionalItems;
          // this.fullLoad = true;
          const cfeConsumption = response.monthlyData?.map(item => item.cfeConsumption ?? 0);
          const consumption = response.monthlyData?.map(item => item.consumption ?? 0);
          const generation = response.monthlyData?.map(item => item.generation ?? 0);
          const exportedSolarGeneration = response.monthlyData?.map(item => item.exportedGeneration ?? 0);

          this.lineChartData = {
            labels: response.monthlyData?.map((item) => {
              return item.month;
            }),
            datasets: [
              {
                type: 'bar',
                data: cfeConsumption ?? [],
                label: 'CFE network consumption (MWh)',
                backgroundColor: 'rgba(121, 36, 48, 1)',
                order: 1
              },
              /*  {
                 type: 'bar',
                 data: exportedSolarGeneration ?? [],
                 label: 'Exported solar generation (MWh)',
                 backgroundColor: 'rgba(255, 71, 19, 1)',
                 order: 1
               }, */
              {
                type: 'bar',
                data: generation ?? [],
                label: 'Generation (MWh)',
                backgroundColor: 'rgba(87, 177, 177, 1)',
                order: 1
              },
              {
                type: 'line',
                data: consumption ?? [],
                borderColor: 'rgba(239, 68, 68, 1)',
                backgroundColor: 'rgba(239, 68, 68, 1)',
                pointBackgroundColor: 'rgba(239, 68, 68, 1)',
                pointBorderColor: 'rgba(239, 68, 68, 1)',
                label: 'Consumption (MWh)',
                order: 0,
              }
            ]
          };

          this.displayChart = true;
          this.isLoading = false;
          this.initChart();
        }
      },
      error: (error) => {
        const errorArray = error?.error?.errors?.errors ?? [];
        if (errorArray.length) {
          this.createNotificationError(this.ERROR, errorArray[0].title, errorArray[0].descripcion, errorArray[0].warn);
        }
        console.error(error)
      }
    })
  }

  getStatus() {
    this.moduleServices.getDataRespStatus().subscribe({
      next: (response: entity.ProjectStatus[]) => this.projectStatus = response,
      error: (error) => {
        this.notificationService.notificacion(`Hable con el administrador.`, 'alert');
        console.error(error)
      }
    })
  }

  refreshChart(index?: number): void {
    if (index == 1) this.showSitePerformance = true
    else this.showSitePerformance = false
  }

  initChart(): void {
    const ctx = document.getElementById('myChartPerformance') as HTMLCanvasElement;
    if (ctx) {
      this.chart = new Chart(ctx, {
        type: 'bar',
        data: this.lineChartData,
        options: this.lineChartOptions
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

    const dialogRef = this.dialog.open(NotificationComponent, {
      width: '540px',
      data: dataNotificationModal
    });
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
