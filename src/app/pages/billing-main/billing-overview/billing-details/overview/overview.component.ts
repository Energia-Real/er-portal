import { Component, Input, OnDestroy, OnInit } from '@angular/core';

import { combineLatest, distinctUntilChanged, Observable, Subject, takeUntil } from 'rxjs';
import { Chart, ChartConfiguration, ChartOptions, registerables } from "chart.js";
import { Store } from '@ngrx/store';
import { BillingService } from '@app/pages/billing-main/billing.service';
import { OpenModalsService } from '@app/shared/services/openModals.service';
import { Router } from '@angular/router';
import { GeneralFilters } from '@app/shared/models/general-models';
import * as entity from '../../../billing-model';
import { start } from '@popperjs/core';

Chart.register(...registerables);

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
  standalone: false
})
export class OverviewComponent implements OnInit, OnDestroy {
  private onDestroy$ = new Subject<void>();

  generalFilters$!: Observable<GeneralFilters>;

  @Input() filterData!: entity.FilterBillingDetails


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
      },
    },
  };

  generalFilters!: GeneralFilters
  balance:string = '0.00'

   constructor(
    private store: Store<{ filters: GeneralFilters }>,
      private moduleServices: BillingService,
      private notificationService: OpenModalsService,
    ) { this.generalFilters$ = this.store.select(state => state.filters)}


  ngOnInit(): void {
    // this.initiLineChartData();
    this.getFilters();
  }

  getFilters() {
    this.generalFilters$.pipe(takeUntil(this.onDestroy$)).subscribe((GeneralFilters) => {
      const filters = {
        startDate: GeneralFilters.startDate,
        endDate: GeneralFilters.endDate,
        ...this.filterData
      };
  
      this.getEnergysummary(filters);
    })
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

  getEnergysummary(filters: entity.FilterBillingEnergysummary) {
    console.log(filters);
    
      this.moduleServices.getEnergysummaryOverview(filters).subscribe({
        next: (response: ChartConfiguration<'bar' | 'line'>['data'] | any) => {
          console.log('OVERVIEW:', response);
          this.lineChartData = response
          this.balance = response.balance
          
        },
        error: error => {
          this.notificationService.notificacion(`Talk to the administrator.`, 'alert');
          console.log(error);
        }
      });
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
