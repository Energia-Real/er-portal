import { Component, Input, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';

import { Subject, takeUntil } from 'rxjs';
import { Chart, ChartConfiguration, ChartOptions, registerables } from "chart.js";
import { BillingService } from '@app/pages/billing-main/billing.service';
import { OpenModalsService } from '@app/shared/services/openModals.service';
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
export class OverviewComponent implements OnInit, OnInit, OnDestroy {
  private onDestroy$ = new Subject<void>();

  @Input() filterData!: entity.BillingOverviewFilterData
  @ViewChild(BaseChartDirective) chartComponent!: BaseChartDirective;

  lineChartData!: ChartConfiguration<'bar' | 'line'>['data'];
  lineChartOptions: ChartOptions<'bar' | 'line'> = {}

  datasetVisibility: boolean[] = [true, true, true];

  balance: string = '0.00'
  buttonClass: string = '';

  filters!: entity.BillingOverviewFilterData
  constructor(
    private moduleServices: BillingService,
    private notificationService: OpenModalsService,
    private translationService: TranslationService
  ) {
    this.initChartOptions();
  }

  ngOnInit(): void {
    this.getFilters();

    this.translationService.currentLang$
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(() => {
        this.initChartOptions();
        this.getEnergysummary(this.filters);

        if (this.chartComponent && this.chartComponent.chart) {
          this.chartComponent.chart.update();
        }
      });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['filterData'] && !changes['filterData'].firstChange) {
      const prev = changes['filterData'].previousValue;
      const curr = changes['filterData'].currentValue;
  
      const startDateChanged = prev?.startDate !== curr?.startDate;
      const endDateChanged = prev?.endDate !== curr?.endDate;
  
      //if (startDateChanged || endDateChanged) {
      this.getFilters();
      //}
    }
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
            callback: function (value: any) {
              if (value >= 1000) {
                return `$ ${value / 1000}K`;
              }
              return `$ ${ value}`
             
            },
          },
        },
        y1: undefined as any
      }

    };
  }


  getFilters() {
    this.filters = {
      customerNames: this.filterData?.customerNames ?? [],
      legalName: this.filterData?.legalName ?? [],
      productType: this.filterData?.productType ?? [],
      startDate: this.filterData?.startDate ?? '',
      endDate: this.filterData?.endDate ?? '',
    };

    this.getEnergysummary(this.filters);
  }

  getEnergysummary(filters: entity.BillingOverviewFilterData) {
      this.moduleServices.getEnergysummaryOverview(filters).subscribe({
      next: (response: ChartConfiguration<'bar' | 'line'>['data'] | any) => {
        // Translate dataset labels
        if (response && response.datasets && response.datasets.length > 0) {
          response.datasets.forEach((dataset: any) => {
            if (dataset.label.includes('Energy Produced')) {
              dataset.labelKey = 'FACTURACION.ENERGIA_PRODUCIDA';
            } else if (dataset.label.includes('Energy Billed')) {
              dataset.labelKey = 'FACTURACION.ENERGIA_FACTURADA';
            } else if (dataset.label.includes('Total Amount')) {
              dataset.labelKey = 'FACTURACION.MONTO_TOTAL';
            }

            dataset.label = this.translationService.instant(dataset.labelKey);
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
