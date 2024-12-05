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

  dots = Array(3).fill(0);
  chart: any;
  chartOptions!: Highcharts.Options;
  Highcharts: typeof Highcharts = Highcharts;
  graphicsType: 'pie' | 'bars' = 'bars';
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
            if (i === 0) {
              dataset.backgroundColor = 'rgba(121, 36, 48, 1)';
            } else {
              dataset.backgroundColor = 'rgba(238, 84, 39, 1)';
            }
          });

          chart.update();
        }
      }
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
            return `${Number(value).toLocaleString('en-US')} MWh`;
          },
        },
        stacked: false,
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
    this.getEstimateds();
    this.dateToday = new Date(this.dateToday.getFullYear(), 0, 1);
    this.getStatus();
    this.getUserClient();
  }

  ngAfterViewInit(): void {
    this.formFilters.valueChanges.pipe(takeUntil(this.onDestroy$)).subscribe(values => this.onFormValuesChanged(values));
  }

  getUserClient() {
    const encryptedData = localStorage.getItem('userInfo');
    if (encryptedData) {
      const userInfo = this.encryptionService.decryptData(encryptedData);
      this.generalFilters$.subscribe((generalFilters: GeneralFilters) => {
        this.getSitePerformance({ idClient: 50, ...generalFilters });
        // this.getSitePerformance({ idClient: userInfo.clientes[0], ...generalFilters });
      });
    }
  }

  getSitePerformance(filters: GeneralFilters) {
    this.moduleServices.getSitePerformance(filters).subscribe({
      next: (response: entity.DataResponseArraysMapper | null) => {
        if (response) {
          this.sitePerformance.primaryElements = response.primaryElements;
          this.sitePerformance.additionalItems = response.additionalItems;
          this.getSitePerformanceSummary({ ...filters, rpu: this.plantData.rpu })
        }
      },
      error: (error) => {
        this.notificationService.notificacion(`Talk to the administrator.`, 'alert');
        console.error(error)
      }
    })
  }

  getSitePerformanceSummary(filters: GeneralFilters) {
    delete filters.idClient
    this.moduleServices.getSitePerformanceSummary(filters).subscribe({
      next: (response: entity.DataResponseArraysMapper) => {
        this.sitePerformance.additionalItems.push(response.additionalItems[0])
        this.fullLoad = true;
      },
      error: (error) => {
        this.sitePerformance.additionalItems.push({
          title: 'CFE network consumption',
          description: null,
        })
        this.notificationService.notificacion(`Talk to the administrator.`, 'alert');
        console.error(error)
      }
    })
  }

  onFormValuesChanged(values: any) {
    if (values.end != '' && values.start != '') this.getEstimateds();
  }

  getEstimateds() {
    this.moduleServices.getEstimatedEnergy(this.plantData?.inverterBrand[0], this.plantData?.plantCode).subscribe({
      next: (response) => {
        const inverterPowerData = response.map(item => this.formatsService.graphFormat(item.inverterPower));
        const estimatedInverterPowerData = response.map(item => this.formatsService.graphFormat(item.estimatedEnergyMWh));

        const seriesData = response.map((item) => {
          let date = new Date(item.collectTime);
          let monthName = new Intl.DateTimeFormat('es-ES', { month: 'long' }).format(date);
          monthName = monthName.charAt(0).toUpperCase() + monthName.slice(1);
          return { name: monthName, y: this.formatsService.graphFormat(item.inverterPower) };
        });
        const colors = ['#792430', '#EE5427', '#57B1B1', '#D97A4D', '#B27676', '#F28C49', '#85B2B2', '#B1D4D4', '#FFD966', '#5A4D79', '#99C2A2', '#FFC4A3', '#8C6E4D'];
        this.lineChartData = {
          labels: response.map((item) => {
            let date = new Date(item.collectTime);
            let monthName = new Intl.DateTimeFormat('es-ES', { month: 'long' }).format(date);
            monthName = monthName.charAt(0).toUpperCase() + monthName.slice(1);
            return monthName;
          }),
          datasets: [
            {
              type: 'bar',
              data: inverterPowerData,
              label: 'Energy Production',
              backgroundColor: 'rgba(121, 36, 48, 1)',
              order: 1
            },
            {
              type: 'line',
              data: estimatedInverterPowerData,
              borderColor: 'rgba(238, 84, 39, 1)',
              backgroundColor: 'rgba(238, 84, 39, 1)',
              pointBackgroundColor: 'rgba(238, 84, 39, 1)',
              pointBorderColor: 'rgba(238, 84, 39, 1)',
              label: 'Estimated Energy Production',
              order: 0,
            }
          ]
        };

        this.displayChart = true;
        this.initChart();
      },
      error: (error) => {
        this.notificationService.notificacion(`Hable con el administrador.`, 'alert');
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
