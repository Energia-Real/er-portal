import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { Subject } from 'rxjs';

// Es importante registrar los componentes si no estás usando Chart.js/auto
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
    const context = this.barChartCanvas.nativeElement.getContext('2d');

    if (context) {
      this.chart = new Chart(context, {
        type: 'bar',
        data: {
          labels: [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
          ],
          datasets: [
            {
              label: 'Generated Energy (kWh)',
              data: [420, 380, 500, 450, 600, 700, 800, 750, 680, 620, 580, 490],
              backgroundColor: '#34D399', // tailwind: emerald-400
              borderRadius: 8,
              barThickness: 20,
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: (value) => `${value} kWh`
              }
            }
          },
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              callbacks: {
                label: (context) => `${context.raw} kWh`
              }
            }
          }
        }
      });
    }
  }

  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.destroy();
    }
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
