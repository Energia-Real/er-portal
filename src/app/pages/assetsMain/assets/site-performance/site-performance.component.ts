import { AfterViewInit, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import * as entity from '../assets-model';
import { AssetsService } from '../assets.service';
import * as Highcharts from 'highcharts';
import { FormBuilder } from '@angular/forms';
import { Chart, ChartConfiguration, ChartOptions } from "chart.js";
import { OpenModalsService } from '@app/shared/services/openModals.service';
import { FormatsService } from '@app/shared/services/formats.service';

@Component({
  selector: 'app-site-performance',
  templateUrl: './site-performance.component.html',
  styleUrls: ['./site-performance.component.scss']
})
export class SitePerformanceComponent implements OnInit, AfterViewInit, OnDestroy {
  private onDestroy = new Subject<void>();
  @Input() assetData!: entity.DataPlant;
  
  chart: any;
  chartOptions!: Highcharts.Options;
  Highcharts: typeof Highcharts = Highcharts;
  graphicsType: 'pie' | 'bars' = 'bars';
  lineChartData!: ChartConfiguration<'bar'>['data'];
  showSitePerformance = false;
  lineChartOptions: ChartOptions<'bar'> = {
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
      },
      
      legend: {
        labels: {
          usePointStyle: true,
        },
        position:"bottom",
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
              dataset.backgroundColor = 'rgba(121, 36, 48, 1)'; // Color original para el primer dataset
            } else {
              dataset.backgroundColor = 'rgba(238, 84, 39, 1)'; // Color original para el segundo dataset
            }
          });

          chart.update();
        }
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
          callback: function(value, index, values) {
            return value + ' MWh'; 
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

  projectStatus!: entity.ProjectStatus[];

  fechaHoy = new Date();

  showAlert: boolean = false;
  displayChart: boolean = false;
  lineChartLegend: boolean = true;

  constructor(
    private formBuilder: FormBuilder,
    private moduleServices: AssetsService,
    private notificationService: OpenModalsService,
    private formatsService: FormatsService
  ) { }

  ngOnInit(): void {
    let dates = this.getFormattedDates();
    this.getMonthResume(dates.fourMonthsAgo, dates.today);
    this.showAlert = false;
    this.fechaHoy = new Date(this.fechaHoy.getFullYear(), 0, 1);
    this.getStatus();
  }

  ngAfterViewInit(): void {
    this.formFilters.valueChanges.pipe(takeUntil(this.onDestroy)).subscribe(values => {
      this.onFormValuesChanged(values);
    });
  }

  onFormValuesChanged(values: any) {
    if (values.end != '' && values.start != '') this.getMonthResume(values.start, values.end);
  }

  getMonthResume(startDate: Date, endDate: Date) {
    this.moduleServices.getProyectResume(this.assetData.inverterBrand[0], this.assetData.plantCode, startDate, endDate).subscribe({
      next: (response) => {
        const monthResume = response[0]?.monthresume;
        if (!monthResume) {
          console.error('monthresume is undefined');
          return;
        }
  
        const inverterPowerData = monthResume.map(item => this.formatsService.graphFormat(item.inverterPower+item.dataRecovery));
        console.log(inverterPowerData)
        //const dataRecoveryData = monthResume.map(item => this.formatsService.graphFormat(item.dataRecovery));
        const seriesData = monthResume.map((item) => {
          let date = new Date(item.collectTime);
          let monthName = new Intl.DateTimeFormat('es-ES', { month: 'long' }).format(date);
          monthName = monthName.charAt(0).toUpperCase() + monthName.slice(1);
          return { name: monthName, y: this.formatsService.graphFormat(item.inverterPower) };
        });
  
        this.chartOptions = {
          chart: {
            type: 'pie'
          },
          title: {
            text: 'Inverter Power Data'
          },
          series: [{
            type: 'pie',
            name: 'Inverter Power',
            data: seriesData
          }],
          plotOptions: {
            pie: {
              dataLabels: {
                enabled: true,
                formatter: function() {
                  return `<b>${this.point.name}</b>: ${this.y!.toLocaleString('en-US', {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0
                  })}`;
                }
              }
            }
          }
        };
  
        this.lineChartData = {
          labels: monthResume.map((item) => {
            let date = new Date(item.collectTime);
            let monthName = new Intl.DateTimeFormat('es-ES', { month: 'long' }).format(date);
            monthName = monthName.charAt(0).toUpperCase() + monthName.slice(1);
            return monthName;
          }),
          datasets: [
            {
              data: inverterPowerData,
              label: 'Inverter Power',
              backgroundColor: 'rgba(121, 36, 48, 1)',
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

  getFormattedDates() {
    const today = new Date();
    const firstDayOfCurrentMonth = new Date(today.getFullYear(), today.getMonth(), - 1);
    const fourMonthsAgo = new Date(today.setMonth(today.getMonth() - 5));
    const firstDayOfFourMonthsAgo = new Date(fourMonthsAgo.getFullYear(), fourMonthsAgo.getMonth(), 1);
    return {
      today: firstDayOfCurrentMonth,
      fourMonthsAgo: firstDayOfFourMonthsAgo
    };
  }

  getStatus() {
    this.moduleServices.getDataRespStatus().subscribe({
      next: (response: entity.ProjectStatus[]) => {
        this.projectStatus = response;
      },
      error: (error) => {
        this.notificationService.notificacion(`Hable con el administrador.`, 'alert');
        console.error(error)
      }
    })
  }

  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.unsubscribe();
  }
  refreshChart(index?:number): void {
    if (index==2) {
      this.showSitePerformance=true
    }
    else{
      this.showSitePerformance=false
    }
    
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

}
