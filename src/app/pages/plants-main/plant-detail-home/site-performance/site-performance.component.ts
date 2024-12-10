import { AfterViewInit, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject, takeUntil } from 'rxjs';
import * as entity from '../../plants-model';
import * as Highcharts from 'highcharts';
import { FormBuilder } from '@angular/forms';
import { Chart, ChartConfiguration, ChartOptions } from "chart.js";
import { OpenModalsService } from '@app/shared/services/openModals.service';
import { FormatsService } from '@app/shared/services/formats.service';
import { PlantsService } from '../../plants.service';
import { FilterState, GeneralFilters } from '@app/shared/models/general-models';
import { Store } from '@ngrx/store';
import { EncryptionService } from '@app/shared/services/encryption.service';

@Component({
  selector: 'app-site-performance',
  templateUrl: './site-performance.component.html',
  styleUrls: ['./site-performance.component.scss']
})
export class SitePerformanceComponent implements OnInit, AfterViewInit, OnDestroy {
  private onDestroy$ = new Subject<void>();
  @Input() plantData!: entity.DataPlant;
  @Input() notData!: boolean;

  generalFilters$!: Observable<FilterState['generalFilters']>;

  chart: any;
  lineChartData!: ChartConfiguration<'bar' | 'line'>['data'];

  lineChartOptions: ChartOptions<'bar' | 'line'> = {
    responsive: false,
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

  constructor(
    private formBuilder: FormBuilder,
    private moduleServices: PlantsService,
    private notificationService: OpenModalsService,
    private encryptionService: EncryptionService,
    private formatsService: FormatsService,
    private store: Store<{ filters: FilterState }>
  ) {
    this.generalFilters$ = this.store.select(state => state.filters.generalFilters);
  }

  ngOnInit(): void {
    this.dateToday = new Date(this.dateToday.getFullYear(), 0, 1);
    this.getStatus();
    this.getUserClient();
  }

  ngAfterViewInit(): void {
  }

  getUserClient() {
    const encryptedData = localStorage.getItem('userInfo');
    if (encryptedData) {
      const userInfo = this.encryptionService.decryptData(encryptedData);
      this.generalFilters$.subscribe((generalFilters: GeneralFilters) => {
        this.getSitePerformance({ idClient: userInfo.clientes[0], ...generalFilters });
      });
    }
  }

  getSitePerformance(filters: GeneralFilters) {
    this.moduleServices.getSitePerformanceDetails(this.plantData.id, filters).subscribe({
      next: (response: entity.DataResponseArraysMapper | null) => {
        if (response) {
          this.sitePerformance.primaryElements = response.primaryElements;
          this.sitePerformance.additionalItems = response.additionalItems;
          this.fullLoad = true;
          const cfeConsumption = response.monthlyData?.map(item => item.cfeConsumption?? 0);
          const consumption = response.monthlyData?.map(item => item.consumption?? 0);
          const generation = response.monthlyData?.map(item => item.generation?? 0);
          const exportedSolarGeneration = response.monthlyData?.map(item => item.exportedGeneration?? 0);



          this.lineChartData = {
            labels: response.monthlyData?.map((item) => {
              return item.month;
            }),
            datasets: [
              {
                type: 'bar',
                data: cfeConsumption?? [],
                label: 'CFE network consumption (kWh)',
                backgroundColor: 'rgba(121, 36, 48, 1)',
                order: 1
              },
              {
                type: 'bar',
                data: exportedSolarGeneration?? [],
                label: 'Exported solar generation (kWh)',
                backgroundColor: 'rgba(255, 71, 19, 1)',
                order: 1
              },
              {
                type: 'bar',
                data: generation?? [],
                label: 'Generation (kWh)',
                backgroundColor: 'rgba(87, 177, 177, 1)',
                order: 1
              },
              {
                type: 'line',
                data: consumption?? [],
                borderColor: 'rgba(239, 68, 68, 1)',
                backgroundColor: 'rgba(239, 68, 68, 1)',
                pointBackgroundColor: 'rgba(239, 68, 68, 1)',
                pointBorderColor: 'rgba(239, 68, 68, 1)',
                label: 'Consumption (kWh)',
                order: 0,
              }
            ]
          };

          this.displayChart = true;
         this.initChart();
        }
      },
      error: (error) => {
        this.notificationService.notificacion(`Talk to the administrator.`, 'alert');
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
    const ctx = document.getElementById('myChart') as HTMLCanvasElement;
    if (ctx) {
      this.chart = new Chart(ctx, {
        type: 'bar',
        data: this.lineChartData,
        options: this.lineChartOptions
      });
    }
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.unsubscribe();
  }
}
