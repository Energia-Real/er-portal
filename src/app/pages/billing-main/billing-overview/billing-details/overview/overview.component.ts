import { Component, Input, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';

import { Observable, Subject, takeUntil } from 'rxjs';
import { Chart, ChartConfiguration, ChartOptions, registerables } from "chart.js";
import { Store } from '@ngrx/store';
import { BillingService } from '@app/pages/billing-main/billing.service';
import { OpenModalsService } from '@app/shared/services/openModals.service';
import { GeneralFilters } from '@app/shared/models/general-models';
import * as entity from '../../../billing-model';
import { BaseChartDirective } from 'ng2-charts';
import { TranslationService } from '@app/shared/services/i18n/translation.service';

Chart.register(...registerables);

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
  standalone: false
})
export class OverviewComponent implements OnInit, OnDestroy {
  private onDestroy$ = new Subject<void>();

  @Input() filterData!: entity.BillingOverviewFilterData
  @ViewChild(BaseChartDirective) chartComponent!: BaseChartDirective;

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
              return `${label}: $${value.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
            }

            return `${label}: ${value.toLocaleString('es-MX')} kWh`;
          }
        },
      },
      legend: {
        display: false,
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
        display: false,
      }
    }
  };

  datasetVisibility: boolean[] = [true, true, true];

  balance: string = '0.00'
  buttonClass: string = '';

  constructor(
    private moduleServices: BillingService,
    private notificationService: OpenModalsService,
    private translationService: TranslationService
  ) {
    this.initChartOptions();
  }

  initChartOptions() {
    this.lineChartOptions = {
      responsive: true,
      interaction: {
        mode: 'index',
        intersect: false,
      },
      plugins: {
        tooltip: {
          usePointStyle: true,
          callbacks: {
            label: (context) => {
              const value = context.raw as number;
              const label = context.dataset.label || '';

              if (label.includes(this.translationService.instant('FACTURACION.MONTO_TOTAL'))) {
                return `${label}: $${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
              }

              return `${label}: ${value.toLocaleString('en-US')} kWh`;
            }
          },
        },
        legend: {
          display: false,
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
        y1: undefined as any
      }

    };
  }

  ngOnInit(): void {
    this.getFilters();

    // Subscribe to language changes to update chart options
    this.translationService.currentLang$
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(() => {
        this.initChartOptions();

        // Update the chart if it exists
        if (this.chartComponent && this.chartComponent.chart) {
          this.chartComponent.chart.update();
        }
      });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['filterData'] && !changes['filterData'].firstChange) {
      const prev = changes['filterData'].previousValue;
      const curr = changes['filterData'].currentValue;
      if (JSON.stringify(prev) !== JSON.stringify(curr)) this.getFilters();
    }
  }

  getFilters() {
    const filters: entity.BillingOverviewFilterData = {
      customerNames: this.filterData?.customerNames ?? [],
      legalName: this.filterData?.legalName ?? [],
      productType: this.filterData?.productType ?? [],
      startDate: this.filterData?.startDate ?? '',
      endDate: this.filterData?.endDate ?? '',
    };
    
    this.getEnergysummary(filters);
  }

  getEnergysummary(filters: entity.BillingOverviewFilterData) {
    this.moduleServices.getEnergysummaryOverview(filters).subscribe({
      next: (response: ChartConfiguration<'bar' | 'line'>['data'] | any) => {
        // Translate dataset labels
        if (response && response.datasets && response.datasets.length > 0) {
          response.datasets.forEach((dataset: any) => {
            if (dataset.label) {
              if (dataset.label.includes('Energy Produced')) {
                dataset.label = this.translationService.instant('FACTURACION.ENERGIA_PRODUCIDA');
              } else if (dataset.label.includes('Energy Billed')) {
                dataset.label = this.translationService.instant('FACTURACION.ENERGIA_FACTURADA');
              } else if (dataset.label.includes('Total Amount')) {
                dataset.label = this.translationService.instant('FACTURACION.MONTO_TOTAL');
              }
            }
          });
        }

        this.lineChartData = response;
        this.balance = response.balance;

        // Update the chart if it exists
        if (this.chartComponent && this.chartComponent.chart) {
          this.chartComponent.chart.update();
        }
      },
      error: error => {
        this.notificationService.notificacion(`Talk to the administrator.`, 'alert');
        console.log(error);
      }
    });
  }

  toggleDataset(index: number) {
    const chart = this.chartComponent.chart;
    if (!chart) return;

    const meta = chart.getDatasetMeta(index);
    this.datasetVisibility[index] = !this.datasetVisibility[index];
    meta.hidden = !this.datasetVisibility[index];
    chart.update();
    this.updateButtonClass();
  }

  showAllDatasets() {
    const chart = this.chartComponent.chart;
    if (!chart) return;

    chart.data.datasets.forEach((_, index) => {
      const meta = chart.getDatasetMeta(index);
      this.datasetVisibility[index] = true;
      meta.hidden = false;
    });

    this.buttonClass = 'filter-unselected';
    chart.update();
  }

  updateButtonClass() {
    const hiddenCount = this.datasetVisibility.filter((isVisible, index) => !isVisible).length;
    this.buttonClass = hiddenCount >= 1 ? 'filter-selected' : 'filter-unselected';
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
