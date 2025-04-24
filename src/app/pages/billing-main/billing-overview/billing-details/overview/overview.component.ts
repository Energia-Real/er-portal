import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { Subject } from 'rxjs';

Chart.register(...registerables);

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit, OnDestroy {
  private onDestroy$ = new Subject<void>();

  @ViewChild('barChartCanvas', { static: true }) barChartCanvas!: ElementRef<HTMLCanvasElement>;
  chart!: Chart;

  ngOnInit(): void {
    this.renderChart();
  }

  renderChart(): void {
    const ctx = this.barChartCanvas.nativeElement.getContext('2d');

    this.chart = new Chart(ctx!, {
      type: 'bar',
      data: {
        labels: [
          'Jan 25', 'Feb 25', 'Mar 25', 'Apr 25', 'May 25', 'Jun 25',
          'Jul 25', 'Aug 25', 'Sep 25', 'Oct 25', 'Nov 25', 'Dec 25'
        ],
        datasets: [
          {
            label: 'Billed energy produced',
            backgroundColor: '#F97316',
            data: [120000, 110000, 115000, 100000, 130000, 125000, 135000, 140000, 125000, 130000, 110000, 120000],
            barThickness: 20,
            
          },
          {
            label: 'Energy billed kWh',
            backgroundColor: '#57B1B1',
            data: [100000, 105000, 110000, 95000, 120000, 115000, 125000, 130000, 120000, 125000, 105000, 115000],
            barThickness: 20,
             
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            stacked: false,
            ticks: {
              color: '#000',
              font: {
                size: 12
              }
            }
          },
          y: {
            beginAtZero: true,
            max: 250000,
            ticks: {
              stepSize: 25000,
              color: '#000',
              callback: function (value:any) {
                return value >= 1000 ? value / 1000 + 'k' : value;
              }
            },
            grid: {
              drawBorder: false
            }
          }
        },
        plugins: {
          legend: {
            display: true,
            position: 'top',
            labels: {
              color: '#000'
            }
          },
          tooltip: {
            mode: 'index',
            intersect: false
          }
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.chart?.destroy();
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
