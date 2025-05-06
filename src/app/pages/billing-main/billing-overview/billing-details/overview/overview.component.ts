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
            const value = context.raw as number;
            const label = context.dataset.label || '';

            if (label.includes('Amount')) {
              return `${label}: $${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
            }

            return `${label}: ${value.toLocaleString('en-US')} kWh`;
          }
        },
      },
      legend: {
        display: true,
        position: 'top', 
        labels: {
          usePointStyle: true,
          color: '#333',
          font: {
            family: 'Arial',
            size: 14,
          },
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        stacked: false,
      },
      y: {
        type: 'linear',
        position: 'left',
        stacked: false,
        grid: {
          color: '#E5E7EB',
        },
        ticks: {
          callback: function (value) {
            return `${value} kWh`;
          },
        },
      },
      y1: {
        type: 'linear',
        position: 'right',
        grid: {
          drawOnChartArea: false,
        },
        ticks: {
          callback: function (value) {
            return `$${(+value).toLocaleString()}`;
          },
        },
      },
    }
  };

  generalFilters!: GeneralFilters
  balance: string = '0.00'

  constructor(
    private store: Store<{ filters: GeneralFilters }>,
    private moduleServices: BillingService,
    private notificationService: OpenModalsService,
  ) { this.generalFilters$ = this.store.select(state => state.filters) }

  ngOnInit(): void {
    this.getFilters();
  }

  getFilters() {
    this.generalFilters$.pipe(takeUntil(this.onDestroy$)).subscribe((GeneralFilters) => {
      const filters = {
        startDate: GeneralFilters.startDate,
        endDate: GeneralFilters.endDate,
        customerName: this.filterData.customerName,
        legalName: this.filterData.legalName,
        siteName: this.filterData.siteName,
        productType: this.filterData.productType,
      };

      this.getEnergysummary(filters);
    })
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
