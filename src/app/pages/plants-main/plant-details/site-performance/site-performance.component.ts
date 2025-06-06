import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { forkJoin, Observable, Subject, takeUntil } from 'rxjs';
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
  filters: any
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

  labelsChart: { key: string; text: string; }[] = [];
  translatedMonthsMap: Record<string, string> = {};


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
        this.filters = { clientId: userInfo.clientes[0], ...generalFilters }
        this.getSitePerformance(this.filters);
      });
    }
  }

  initializeTranslations(response: entity.DataResponseArraysMapper): void {
    const keysChart2 = [
      'DETALLE_PLANTA.GENERACION',
      'DETALLE_PLANTA.CONSUMO_CFE_RED',
      'DETALLE_PLANTA.CONSUMO_CFE'
    ];

    const months: Record<string, string> = {
      JAN: 'MESES.ENE',
      FEB: 'MESES.FEB',
      MAR: 'MESES.MAR',
      APR: 'MESES.ABR',
      MAY: 'MESES.MAY',
      JUN: 'MESES.JUN',
      JUL: 'MESES.JUL',
      AUG: 'MESES.AGO',
      SEP: 'MESES.SEP',
      OCT: 'MESES.OCT',
      NOV: 'MESES.NOV',
      DEC: 'MESES.DIC'
    };

    const monthKeys = Object.values(months);
    const chartTranslations$ = forkJoin(keysChart2.map(k => this.translationService.getTranslation(k)));
    const monthTranslations$ = forkJoin(monthKeys.map(k => this.translationService.getTranslation(k)));

    forkJoin([chartTranslations$, monthTranslations$]).subscribe(([[generacion, produccion, consumo], translatedMonths]) => {
      this.labelsChart = [
        { key: keysChart2[0], text: generacion },
        { key: keysChart2[1], text: produccion },
        { key: keysChart2[2], text: consumo }
      ];

      this.translatedMonthsMap = Object.keys(months).reduce((acc, abbr, index) => {
        acc[abbr] = translatedMonths[index];
        return acc;
      }, {} as Record<string, string>);

      this.updateClientsChart(response);
    });
  }

  updateClientsChart(dataResponse: entity.DataResponseArraysMapper) {
    this.sitePerformance.primaryElements = dataResponse.primaryElements;
    this.sitePerformance.additionalItems = dataResponse.additionalItems;

    const labels = this.labelsChart.map(l => l.text);
    const translatedMonthsMap = this.translatedMonthsMap;

    const chartLabels = dataResponse.monthlyData?.map((item: any) => {
      const match = item.month.match(/^([A-Z]+)\((\d{2})\)$/);
      if (match) {
        const [_, monthAbbr, year] = match;
        const translatedMonth = translatedMonthsMap[monthAbbr] ?? monthAbbr;
        return `${translatedMonth} (${year})`;
      }
      return item.month;
    });

    console.log(chartLabels);


    this.lineChartData = {
      labels: chartLabels,
      datasets: [
        {
          type: 'bar',
          data: dataResponse?.monthlyData?.map((item: any) => item.cfeConsumption ?? 0)!,
          label: labels[0],
          backgroundColor: 'rgba(121, 36, 48, 1)',
          order: 1
        },
        {
          type: 'bar',
          data: dataResponse?.monthlyData?.map((item: any) => item.generation ?? 0)!,
          label: labels[1],
          backgroundColor: 'rgba(87, 177, 177, 1)',
          order: 1
        },
        {
          type: 'line',
          data: dataResponse?.monthlyData?.map((item: any) => item.consumption ?? 0)!,
          label: labels[2],
          borderColor: 'rgba(239, 68, 68, 1)',
          backgroundColor: 'rgba(239, 68, 68, 1)',
          pointBackgroundColor: 'rgba(239, 68, 68, 1)',
          pointBorderColor: 'rgba(239, 68, 68, 1)',
          order: 0,
        }
      ]
    };

    this.displayChart = true;
    this.isLoading = false;
    this.initChart();
    this.chart?.update();
  }

  getSitePerformance(filters?: GeneralFilters) {
    this.moduleServices.getSitePerformanceDetails(this.plantData.id, filters!).subscribe({
      next: (response: entity.DataResponseArraysMapper | null) => {
        if (response) {
          this.sitePerformance.primaryElements = response.primaryElements;
          this.sitePerformance.additionalItems = response.additionalItems;
          this.initializeTranslations(response)
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
