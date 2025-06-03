import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import * as entity from '../../plants-model';
import { Observable, Subject, takeUntil } from 'rxjs';
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
        },
        position: "bottom",
        /* onHover: (event, legendItem, legend) => {
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
            if (i === 0) {
              dataset.backgroundColor = 'rgba(121, 36, 48, 1)';
            } else {
              dataset.backgroundColor = 'rgba(238, 84, 39, 1)';
            }
          });

          chart.update();
        } */
      }
    },

    scales: {
      x: {
        stacked: true,
        grid: {
          display: false,
        },
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
      .subscribe(() => this.getUserClient());
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

  getSavings(filters: GeneralFilters) {
    this.moduleServices.getSavingDetails(filters, this.plantData.id).subscribe({
      next: (response: GeneralResponse<entity.getSavingsDetails>) => {
        this.savingDetails = Mapper.getSavingsDetailsMapper(response.response, this.translationService);
        const cfeSubtotalData = response.response.monthlyData.map(item => this.formatsService.savingsGraphFormat(item.cfeSubtotal));
        const erSubtotalData = response.response.monthlyData.map(item => this.formatsService.savingsGraphFormat(item.erSubtotal));
        const savingsData = response.response.monthlyData.map(item => this.formatsService.savingsGraphFormat(item.savings));
        const expensesWithoutEnergiaRealData = response.response.monthlyData.map(item => this.formatsService.savingsGraphFormat(item.expenditureWithoutER));

        this.lineChartData = {
          labels: response.response.monthlyData.map((item) => {
            return item.month;
          }),
          datasets: [
            {
              type: 'bar',
              data: cfeSubtotalData,
              label: 'CFE Subtotal (MXN)',
              backgroundColor: 'rgba(121, 36, 48, 1)',
              order: 1
            },
            {
              type: 'bar',
              data: erSubtotalData,
              label: 'Energía Real Subtotal (MXN)',
              backgroundColor: 'rgba(255, 71, 19, 1)',
              order: 1
            },
            {
              type: 'bar',
              data: savingsData,
              label: 'Economic Savings (MXN)',
              backgroundColor: 'rgba(87, 177, 177, 1)',
              order: 1
            },
            {
              type: 'line',
              data: expensesWithoutEnergiaRealData,
              borderColor: 'rgba(239, 68, 68, 1)',
              backgroundColor: 'rgba(239, 68, 68, 1)',
              pointBackgroundColor: 'rgba(239, 68, 68, 1)',
              pointBorderColor: 'rgba(239, 68, 68, 1)',
              label: 'Expenses without Energía Real (MXN)',
              order: 0,
            }
          ]
        };
        this.displayChart = true;
        this.initChart();
      },
      error: (error) => {
        this.notificationService.notificacion(`Talk to the administrator.`, 'alert')
        console.log(error);
      }
    })
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
