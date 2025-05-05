import { Component, OnDestroy, OnInit } from '@angular/core';

import { Subject } from 'rxjs';
import { Chart, ChartConfiguration, ChartOptions, registerables } from "chart.js";

Chart.register(...registerables);

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
})
export class OverviewComponent implements OnInit, OnDestroy {
  private onDestroy$ = new Subject<void>();

  lineChartData!: ChartConfiguration<'bar'>['data'];
  lineChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    animation: {
      onComplete: () => { },
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
            return `${context.dataset.label}: ${value} kWh`;
          },
        },
      },
      legend: {
        display: false,
        labels: {
          usePointStyle: true,
        },
        position: 'right',
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
            dataset.backgroundColor = i === 0 ? '#F97316' : '#57B1B1';
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
            const numericValue = typeof value == 'number' ? value : parseFloat(value as string);

            if (!isNaN(numericValue)) {
              return `${numericValue} kWh`;
            }
            return '';
          },
          stepSize: 25,
        },
        min: 0, 
        max: 250, 
        stacked: false,
        grid: {
          color: '#E5E7EB', 
        },
      },
    },
    backgroundColor: 'rgba(242, 46, 46, 1)', 
  };

  ngOnInit(): void {
    this.initiLineChartData();
  }

  initiLineChartData() {
    this.lineChartData = {
      labels: ['Jan 25', 'Feb 25', 'Mar 25', 'Apr 25', 'May 25', 'Jun 25', 'Jul 25', 'Aug 25', 'Sep 25', 'Oct 25', 'Nov 25', 'Dec 25'],
      datasets: [
        {
          data: [100, 125, 150, 175, 135, 120, 150, 120, 150, 175, 150, 125], 
          label: 'Energy Production',
          backgroundColor: '#F97316', 
        },
        {
          data: [90, 115, 140, 165, 190, 120, 120, 150, 120, 165, 140, 115],
          label: 'Energy Consumption',
          backgroundColor: '#57B1B1',
        }
      ]
    };
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
