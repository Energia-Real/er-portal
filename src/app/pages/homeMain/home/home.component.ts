import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { provideNativeDateAdapter } from '@angular/material/core';
import { ViewEncapsulation } from '@angular/core';
import { SharedComponensModule } from '@app/shared/components/shared-components.module';
import { Observable, Subject } from 'rxjs';
import { MaterialModule } from '@app/shared/material/material.module';
import * as entity from './home-model';
import { Router } from '@angular/router';
import { HomeService } from './home.service';
import { OpenModalsService } from '@app/shared/services/openModals.service';
import { CommonModule } from '@angular/common';
import { MatSort } from '@angular/material/sort';
import { MessageNoDataComponent } from '@app/shared/components/message-no-data/message-no-data.component';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { Chart, ChartConfiguration, ChartOptions, registerables } from "chart.js";
import moment from 'moment';
import { BaseChartDirective, NgChartsModule } from 'ng2-charts';
import { FormatsService } from '@app/shared/services/formats.service';
import { FilterState, GeneralFilters, UserInfo } from '@app/shared/models/general-models';
import { Store } from '@ngrx/store';
import { EncryptionService } from '@app/shared/services/encryption.service';

Chart.register(...registerables);
@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  imports: [CommonModule, SharedComponensModule, MaterialModule, MessageNoDataComponent, ReactiveFormsModule, NgChartsModule],
  styleUrl: './home.component.scss',
  providers: [provideNativeDateAdapter()],
  encapsulation: ViewEncapsulation.None
})
export class HomeComponent implements OnInit, OnDestroy {
  private onDestroy$ = new Subject<void>();
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;

  filters$!: Observable<FilterState['filters']>;
  generalFilters$!: Observable<FilterState['generalFilters']>;
  months: { value: string, viewValue: string }[] = [
    { value: '01', viewValue: 'January' },
    { value: '02', viewValue: 'February' },
    { value: '03', viewValue: 'March' },
    { value: '04', viewValue: 'April' },
    { value: '05', viewValue: 'May' },
    { value: '06', viewValue: 'June' },
    { value: '07', viewValue: 'July' },
    { value: '08', viewValue: 'August' },
    { value: '09', viewValue: 'September' },
    { value: '10', viewValue: 'October' },
    { value: '11', viewValue: 'November' },
    { value: '12', viewValue: 'December' }
  ];

  dataSource = new MatTableDataSource<any>([]);
  labels = [];
  data = [5, 4, 3]
  displayedColumns: string[] = [
    'siteName',
    'energyConsumption',
    'energyProduction',
    'solarCoverage',
    'co2Saving',
    'siteStatus'
  ];

  lineChartData!: ChartConfiguration<'bar'>['data'];
  lineChartOptions: ChartOptions<'bar'> = {
    responsive: true,
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
              dataset.backgroundColor = 'rgba(87, 177, 177, 1)';
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
            return `${Number(value).toLocaleString('en-US')} kWh`;
          },
        },
        stacked: false,
        grid: {
          display: false,
        },
      },
    },
    backgroundColor: 'rgba(242, 46, 46, 1)',
  };

  selection = new SelectionModel<entity.PeriodicElement>(true, []);

  currentYear = new Date().getFullYear();

  selectedEndMonth: number = new Date().getMonth() + 1;

  solarCoverage: string = '';

  dayOrMount = new FormControl('month');

  allRowsInit: boolean = true;
  showLoader: boolean = true;

  selectedMonths: any[] = [];
  dataTooltipsInfo: entity.statesResumeTooltip[] = [];

  savingsDetails!: entity.SavingDetailsResponse;

  userInfo!: UserInfo;

  formFilters = this.formBuilder.group({
    rangeDateStart: [{ value: '', disabled: false }],
    rangeDateEnd: [{ value: '', disabled: false }]
  });

  constructor(
    private moduleServices: HomeService,
    private router: Router,
    private formBuilder: FormBuilder,
    private notificationService: OpenModalsService,
    private formatsService: FormatsService,
    private encryptionService: EncryptionService,
    private store: Store<{ filters: FilterState }>
  ) {
    this.filters$ = this.store.select(state => state.filters.filters);
    this.generalFilters$ = this.store.select(state => state.filters.generalFilters);
  }

  ngOnInit(): void {
    this.getFilters();
    this.getUserClient();
    this.initiLineChartData();
  }

  initiLineChartData() {
    this.lineChartData = {
      labels: this.labels,
      datasets: [
        {
          data: [],
          label: 'Energy Production',
          backgroundColor: 'rgba(121, 36, 48, 1)',
        },
        {
          data: [],
          label: 'Energy Consumption',
          backgroundColor: 'rgba(87, 177, 177, 1)',
        }
      ]
    };
  }

  getFilters() {
    this.filters$.subscribe(filters => {
      if (filters?.months?.length) this.getTooltipInfo(filters);
    });
  }

  getDataSavingDetails(filters: GeneralFilters) {
    this.moduleServices.getDataSavingDetails(filters).subscribe({
      next: (response: entity.SavingDetailsResponse) => this.savingsDetails = response,
      error: (error) => {
        this.notificationService.notificacion(`Talk to the administrator.`, 'alert')
        console.log(error);
      }
    })
  }

  getDataClients(filters: entity.GeneralFilters) {
    this.moduleServices.getDataClients(filters).subscribe({
      next: (response: entity.DataRespSavingDetailsMapper) => {
        this.dataSource.data = response.data
        this.dataSource.sort = this.sort;
        this.selection.clear();
        this.toggleAllRows();
        this.allRowsInit = false;
      },
      error: (error) => {
        this.notificationService.notificacion(`Talk to the administrator.`, 'alert')
        console.log(error);
      }
    })
  }

  getUserClient() {
    const encryptedData = localStorage.getItem('userInfo');
    if (encryptedData) {
      const userInfo = this.encryptionService.decryptData(encryptedData);
      this.generalFilters$.subscribe((generalFilters: GeneralFilters) => {
        this.getDataClients({ clientId: userInfo?.clientes[0], ...generalFilters });
        this.getDataSavingDetails({ clientId: userInfo?.clientes[0], ...generalFilters });
        this.getDataSolarCoverga({ clientId: userInfo?.clientes[0], ...generalFilters });
      });
    }
  }

  getDataSolarCoverga(filters: entity.GeneralFilters) {
    this.moduleServices.getDataSolarCoverage(filters).subscribe({
      next: (response: string) => this.solarCoverage = response,
      error: (error) => {
        console.error(error)
      }
    })
  }

  getTooltipInfo(filters?: any) {
    this.moduleServices.getDataStates(filters).subscribe({
      next: (response: entity.statesResumeTooltip[]) => {
        this.dataTooltipsInfo = response;
      },
      error: (error) => {
        this.notificationService.notificacion(`Talk to the administrator.`, 'alert');
        console.log(error);
      }
    })
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      this.updtChart();

      return;
    }

    this.selection.select(...this.dataSource.data);
    this.updtChart();
  }

  toggleRow(row: any) {
    this.selection.toggle(row);
    this.updtChart();
  }

  updtChart() {
    if (this.chart) {
      let romevingType: any = this.selection.selected;
      let newData = this.mappingData(romevingType);
      this.lineChartData.labels = newData.labels
      this.lineChartData.datasets[0].data = newData.energyProduction;
      this.lineChartData.datasets[1].data = newData.energyConsumption;
      this.chart.update();
    }
  }

  mappingData(dataSelected: entity.DataRespSavingDetails[]): any {
    let labels = dataSelected.map(item => item.siteName);
    let energyConsumption = dataSelected.map(item => this.formatsService.homeGraphFormat(item.energyConsumption));
    let energyProduction = dataSelected.map(item => this.formatsService.homeGraphFormat(item.energyProduction));

    return {
      labels: labels,
      energyConsumption: energyConsumption,
      energyProduction: energyProduction
    }
  }

  convertToISO8601(month: string): string {
    const year = new Date().getFullYear();
    const date = moment(`${year}-${month}-01`).startOf('month').toISOString();
    return date;
  }

  checkboxLabel(row?: entity.PeriodicElement): string {
    if (!row) return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }

  goDetails(id: string) {
    this.router.navigateByUrl(`er/plants/details/${id}`)
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.unsubscribe();
  }
}
