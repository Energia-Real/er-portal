import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import * as entity from '../../plants-model';
import { forkJoin, Observable, Subject, takeUntil } from 'rxjs';
import { PlantsService } from '../../plants.service';
import { Store } from '@ngrx/store';
import { OpenModalsService } from '@app/shared/services/openModals.service';
import { DataResponseArraysMapper, GeneralFilters, GeneralResponse } from '@app/shared/models/general-models';
import { Mapper } from '../../mapper';
import { Chart, ChartConfiguration, ChartOptions } from 'chart.js';
import { FormatsService } from '@app/shared/services/formats.service';
import { EncryptionService } from '@app/shared/services/encryption.service';
import { TranslationService } from '@app/shared/services/i18n/translation.service';

@Component({
  selector: 'app-savings',
  templateUrl: './savings.component.html',
  styleUrl: './savings.component.scss',
  standalone: false
})
export class SavingsComponent implements OnInit, OnDestroy {
  private onDestroy$ = new Subject<void>();
  @Input() plantData: entity.DataPlant | any;
  @Input() notData!: boolean;

  generalFilters$!: Observable<GeneralFilters>;

  lineChartData!: ChartConfiguration<'bar' | 'line'>['data'];
  chart: any;

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
            return `$ ${Number(value).toLocaleString('en-US')} (MXN)`;
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

  displayChart: boolean = false;

  savingDetails: DataResponseArraysMapper = {
    primaryElements: [],
    additionalItems: []
  };

  isLoading: boolean = true;

  labelsChart: { key: string; dataKey: string; color: any }[] = [];
  translatedChartMap: Record<string, string> = {};

  translatedMonthsMap: Record<string, string> = {};

  constructor(
    private moduleServices: PlantsService,
    private notificationService: OpenModalsService,
    private store: Store<{ filters: GeneralFilters }>,
    private formatsService: FormatsService,
    private encryptionService: EncryptionService,
    private translationService: TranslationService
  ) {
    this.generalFilters$ = this.store.select(state => state.filters);
  }

  ngOnInit(): void {
    this.getUserClient();

    // Subscribe to language changes
    this.translationService.currentLang$
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(() => {
        this.initializeTranslations();
      });
  }

  initializeTranslations(): void {
    const chartKeys = [
      { key: 'GRAFICOS.CFE_SUBTOTAL', dataKey: 'cfeSubtotal', color: 'rgba(121, 36, 48, 1)' },
      {
        key: 'GRAFICOS.ENERGIA_REAL_SUBTOTAL', dataKey: 'erSubtotal', color: 'rgba(255, 71, 19, 1)',
      },
      { key: 'GRAFICOS.GASTOS_SIN_ENERGIA_REAL', dataKey: 'expenditureWithoutER', color: 'rgba(239, 68, 68, 1)' },
      { key: 'GRAFICOS.AHORRO_ECONOMICO', dataKey: 'savings', color: 'rgba(87, 177, 177, 1)', },
    ];

    const months: Record<string, string> = {
      January: 'MESES.ENE',
      February: 'MESES.FEB',
      March: 'MESES.MAR',
      April: 'MESES.ABR',
      May: 'MESES.MAY',
      June: 'MESES.JUN',
      July: 'MESES.JUL',
      August: 'MESES.AGO',
      September: 'MESES.SEP',
      October: 'MESES.OCT',
      November: 'MESES.NOV',
      December: 'MESES.DIC'
    };

    const monthKeys = Object.values(months);
    const chartTranslations$ = forkJoin(chartKeys.map(k => this.translationService.getTranslation(k.key)));
    const monthTranslations$ = forkJoin(monthKeys.map(k => this.translationService.getTranslation(k)));

    forkJoin([chartTranslations$, monthTranslations$]).subscribe(([chartTranslations, translatedMonths]) => {
      this.labelsChart = chartKeys;

      this.translatedChartMap = chartKeys.reduce((acc, item, index) => {
        acc[item.key] = chartTranslations[index];
        return acc;
      }, {} as Record<string, string>);

      this.translatedMonthsMap = Object.keys(months).reduce((acc, abbr, index) => {
        acc[abbr] = translatedMonths[index];
        return acc;
      }, {} as Record<string, string>);
    });
  }

  getUserClient() {
    const encryptedData = localStorage.getItem('userInfo');
    if (encryptedData) {
      const userInfo = this.encryptionService.decryptData(encryptedData);

      this.generalFilters$.subscribe((generalFilters: GeneralFilters) => {
        this.getSavings({ clientId: userInfo.clientes[0], ...generalFilters });
      });
    }
  }

  updateClientsChart(dataResponse: entity.getSavingsDetails) {
    //const labels = this.labelsChart.map(l => l.text);
    const translatedMonthsMap = this.translatedMonthsMap;

    const chartLabels = dataResponse.monthlyData?.map((item: any) => {
      const match = item.month.match(/^([A-Z]+)\((\d{2})\)$/);
      if (match) {
        const [_, monthAbbr, year] = match;
        const translatedMonth = this.translatedMonthsMap[monthAbbr] ?? monthAbbr;
        return `${translatedMonth} (${year})`;
      } else {
        return this.translatedMonthsMap[item.month] ?? item.month;
      }
    });


    this.lineChartData = {
      labels: chartLabels,
      datasets: this.labelsChart.map((labelItem, index) => {
        const isLine = labelItem.dataKey === 'expenditureWithoutER';

        return {
          type: isLine ? 'line' : 'bar',
          data: dataResponse.monthlyData.map(item =>
            this.formatsService.savingsGraphFormat((item as Record<string, any>)[labelItem.dataKey])
          ),
          label: this.translatedChartMap[labelItem.key],
          backgroundColor: labelItem.color,
          borderColor: isLine ? labelItem.color : undefined,
          pointBackgroundColor: isLine ? labelItem.color : undefined,
          pointBorderColor: isLine ? labelItem.color : undefined,
          order: isLine ? 0 : 1
        };
      })
    };

    this.displayChart = true;
    this.isLoading = false;
    this.initChart();
    this.chart?.update();
  }

  getSavings(filters: GeneralFilters) {
    this.moduleServices.getSavingDetails(filters, this.plantData.id).subscribe({
      next: (response: GeneralResponse<entity.getSavingsDetails>) => {
        this.updateClientsChart(response.response);
        this.savingDetails = Mapper.getSavingsDetailsMapper(response.response, this.translationService);
      },
      error: (error) => {
        this.notificationService.notificacion(`Talk to the administrator.`, 'alert');
        console.log(error);
      }
    });
  }

  initChart(): void {
    const ctx = document.getElementById('myChart') as HTMLCanvasElement;
    if (ctx) {
      this.chart = new Chart(ctx, {
        type: 'bar',
        data: this.lineChartData,
        options: this.lineChartOptions
      });
    }
  }

  getDataClient() {
    this.moduleServices.getDataClient().subscribe({
      next: (response: entity.DataRespSavingDetailsList[]) => {
        this.generalFilters$.subscribe((generalFilters: GeneralFilters) => {
          this.getSavings({ clientId: response[0].clientId, ...generalFilters });
        });
      },
      error: (error) => {
        this.notificationService.notificacion(`Talk to the administrator.`, 'alert')
        console.log(error);
      }
    })
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
