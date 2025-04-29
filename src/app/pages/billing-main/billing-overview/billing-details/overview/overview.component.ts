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

  lineChartData!: ChartConfiguration<'bar' | 'line'>['data'];

  lineChartOptions: ChartOptions<'bar' | 'line'> = {
    responsive: true,
    interaction: {
      mode: 'index',
      intersect: false,
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
        display: true,
        labels: {
          usePointStyle: true,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        stacked: false,
      },
      y: {
        stacked: false,
        grid: {
          color: '#E5E7EB',
        },
        ticks: {
          callback: function (value) {
            return `${value} kWh`;
          },
        },
        min: 0,
        max: 250,
      },
    },
  };

  ngOnInit(): void {
    this.initiLineChartData();
  }

  initiLineChartData() {
    this.lineChartData = {
      labels: ['Jan 25', 'Feb 25', 'Mar 25', 'Apr 25', 'May 25', 'Jun 25', 'Jul 25', 'Aug 25', 'Sep 25', 'Oct 25', 'Nov 25', 'Dec 25'],
      datasets: [
        {
          type: 'bar',
          label: 'Energy Produced (kWh)',
          data: [250, 80, 200, 140, 150, 130, 160, 120, 80, 70, 220, 40],
          backgroundColor: '#F97316',
          barPercentage: 0.8,
          categoryPercentage: 0.9,
          order: 1
        },
        {
          type: 'bar',
          label: 'Energy Billed (kWh)',
          data: [150, 180, 50, 120, 130, 110, 190, 100, 150, 170, 180, 70],
          backgroundColor: '#57B1B1',
          barPercentage: 0.8,
          categoryPercentage: 0.9,
          order: 1
        },
        {
          type: 'line',
          label: 'Trend',
          data: [140, 110, 90, 60, 90, 110, 110, 90, 150, 200, 130, 140],
          borderColor: '#6B021A',
          backgroundColor: '#6B021A',
          tension: 0.4,
          pointRadius: 4,
          pointBackgroundColor: '#6B021A',
          borderWidth: 2,
          order: 3
        }
      ]
    };
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
