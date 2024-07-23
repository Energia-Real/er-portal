import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { provideNativeDateAdapter } from '@angular/material/core';
import * as Highcharts from 'highcharts';
import { ViewEncapsulation } from '@angular/core';
import { LayoutModule } from '@app/shared/components/layout/layout.module';
import { Subject, takeUntil } from 'rxjs';
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
import { AuthService } from '@app/auth/auth.service';
import { User } from '@app/shared/models/general-models';

Chart.register(...registerables);
@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  imports: [CommonModule, LayoutModule, MaterialModule, MessageNoDataComponent, ReactiveFormsModule, NgChartsModule],
  styleUrl: './home.component.scss',
  providers: [provideNativeDateAdapter()],
  encapsulation: ViewEncapsulation.None
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  private onDestroy = new Subject<void>();
  dataSource = new MatTableDataSource<any>([]);
  lineChartData!: ChartConfiguration<'bar'>['data'];
  labels = [];
  data = [5, 4, 3]

  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  @ViewChild(MatSort, { static: false }) sort!: MatSort;

  displayedColumns: string[] = [
    // 'select',
    'siteName',
    'energyConsumption',
    'energyProduction',
    'solarCoverage',
    'co2Saving',
    'siteStatus'
  ];

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
            const value = Math.abs(context.raw as number);
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
            return Math.abs(Number(value)) + ' kWh';
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

  months: { value: string, viewValue: string, disabled: boolean, check: boolean }[] = [
    { value: '01', viewValue: 'January', disabled: false, check: false },
    { value: '02', viewValue: 'February', disabled: false, check: false },
    { value: '03', viewValue: 'March', disabled: false, check: false },
    { value: '04', viewValue: 'April', disabled: false, check: false },
    { value: '05', viewValue: 'May', disabled: false, check: false },
    { value: '06', viewValue: 'June', disabled: false, check: false },
    { value: '07', viewValue: 'July', disabled: false, check: false },
    { value: '08', viewValue: 'August', disabled: false, check: false },
    { value: '09', viewValue: 'September', disabled: false, check: false },
    { value: '10', viewValue: 'October', disabled: false, check: false },
    { value: '11', viewValue: 'November', disabled: false, check: false },
    { value: '12', viewValue: 'December', disabled: false, check: false }
  ];

  currentYear = new Date().getFullYear();
  dayOrMount = new FormControl('month');
  selectedMonths: any[] = [];
  selectedEndMonth: number = new Date().getMonth() + 1;
  selection = new SelectionModel<entity.PeriodicElement>(true, []);
  allRowsInit = true;

  showLoader: boolean = true;
  userInfo: any
  dataClientsList: entity.DataRespSavingDetailsList[] = []
  dataClientsBatu: any

  savingsDetails: any = {
    totalEnergyConsumption: 0,
    totalEnergyProduction: 0
  }

  solarCovergaCo2!: entity.FormatCards[];

  formFilters = this.formBuilder.group({
    rangeDateStart: [{ value: '', disabled: false }],
    rangeDateEnd: [{ value: '', disabled: false }],
  });

  constructor(
    private homeService: HomeService,
    private router: Router,
    private formBuilder: FormBuilder,
    private notificationService: OpenModalsService,
    private formatsService: FormatsService,
    private accountService: AuthService
  ) { }

  ngOnInit(): void {
    this.getInfoUser();
    this.getDataClientsList();
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
          label: 'Energy Consuption',
          backgroundColor: 'rgba(87, 177, 177, 1)',

        }
      ]
    };
  }

  ngAfterViewInit(): void {
    this.dayOrMount.valueChanges.pipe(takeUntil(this.onDestroy)).subscribe(content => {
      this.searchWithFilters()
    })
  }

  setMounts() {
    const currentMonthIndex = new Date().getMonth();
    const previousMonthIndex = currentMonthIndex === 0 ? 11 : currentMonthIndex - 1;
  
    this.selectedMonths = [this.months[previousMonthIndex], this.months[currentMonthIndex]];
  }
  // this.updateMonthStatus();

  updateMonthStatus(): void {
    this.months.forEach((month, index) => {
      month.check = this.selectedMonths.some(selected => selected.value === month.value);
      // month.disabled = this.isDisabled(index);
    });
  }


  searchWithFilters() {
    let filters: any = {};
    let filtersSolarCoverage: any = {
      brand: "huawei",
      clientName: "Merco",
      months: []
    }

    if (this.dayOrMount?.value == 'day' && this.formFilters?.get('rangeDateStart')?.value && this.formFilters?.get('rangeDateEnd')?.value) {
      filters.requestType = 'Day'
      filters.startDate = `${moment(this.formFilters?.get('rangeDateStart')?.value).format('YYYY-MM-DD')}`,
        filters.endDate = `${moment(this.formFilters?.get('rangeDateEnd')?.value!).format('YYYY-MM-DD')}`
      // filters.startDate = `${moment(this.formFilters?.get('rangeDateStart')?.value).format('MM/DD/YYYY')}`,
      //   filters.endDate = `${moment(this.formFilters?.get('rangeDateEnd')?.value!).format('MM/DD/YYYY')}`


      filtersSolarCoverage.requestType = 1;
      filtersSolarCoverage.startDate = `${moment(this.formFilters?.get('rangeDateStart')?.value).format('YYYY-MM-DD')}`,
      filtersSolarCoverage.endDate = `${moment(this.formFilters?.get('rangeDateEnd')?.value!).format('YYYY-MM-DD')}`

      // filtersSolarCoverage.startDate = `${moment(this.formFilters?.get('rangeDateStart')?.value).toISOString()}`;
      // filtersSolarCoverage.endDate = `${moment(this.formFilters?.get('rangeDateEnd')?.value).toISOString()}`;


    } else if (this.dayOrMount?.value == 'month' && this.selectedMonths.length) {
      filters.requestType = 'Month'
      filters.months = this.selectedMonths.map(month => `${this.currentYear}-${month.value}-01`);

      filtersSolarCoverage.requestType = 2
      filtersSolarCoverage.months = this.selectedMonths.map(month => this.currentYear+'-'+month.value+'-01');
      // filtersSolarCoverage.months = this.selectedMonths.map(month => this.convertToISO8601(month.value));
    }

    this.getDataClients(filters)
    this.getDataSolarCovergaCo2(filtersSolarCoverage);
  }


  getDataClients(filters?: any) {
    this.homeService.getDataClients(filters).subscribe({
      next: (response: entity.DataRespSavingDetailsMapper) => {
        this.dataSource.data = response.data
        this.savingsDetails = response.savingDetails;
        this.dataSource.sort = this.sort;
        this.selection.clear();
        this.toggleAllRows();
        this.allRowsInit = false;

        if (this.dayOrMount.value == 'month') {
          filters.energyProduction = response.savingDetails.totalEnergyProduction ? parseFloat(response.savingDetails.totalEnergyProduction.replace(/,/g, '')) : 0;
          delete filters.requestType
          this.getDataBatuSavings(filters);
        }
      },
      error: (error) => {
        this.notificationService.notificacion(`Talk to the administrator.`, 'alert')
        console.error(error)
      }
    })
  }

  getDataClientsList() {
    this.homeService.getDataClientsList().subscribe({
      next: (response: entity.DataRespSavingDetailsList[]) => {
        this.dataClientsList = response;
        this.searchWithFilters()
      },
      error: (error) => {
        this.notificationService.notificacion(`Talk to the administrator.`, 'alert')
        console.error(error)
      }
    })
  }

  getDataSolarCovergaCo2(filters?: string) {
    this.homeService.getDataSolarCovergaCo2(filters).subscribe({
      next: (response: entity.FormatCards[]) => {
        this.solarCovergaCo2 = response;
      },
      error: (error) => {
        this.dataClientsBatu = null;
        console.error(error)
      }
    })
  }

  getDataBatuSavings(filters?: string) {
    console.log('getDataBatuSavings', filters);

    this.homeService.getDataBatuSavings(this.dataClientsList[0]?.id, filters).subscribe({
      next: (response: any) => {
        this.dataClientsBatu = response;
      },
      error: (error) => {
        this.dataClientsBatu = null;
        console.error(error)
      }
    })
  }

  getInfoUser() {
    this.accountService.getInfoUser().subscribe((data: User) => {
      this.userInfo = data;
      this.setMounts();
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
      return;
    }

    this.selection.select(...this.dataSource.data);
    this.updtChart();
    this.printSelectedData();
  }

  toggleRow(row: any) {
    this.selection.toggle(row);
    this.updtChart();
  }

  checkboxLabel(row?: entity.PeriodicElement): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }

    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }

  goDetails(id: string) {
    this.router.navigateByUrl(`/assets/details/${id}`)
  }

  get searchFilters() {
    if (!this.dayOrMount) return false;
    const daySelected = this.dayOrMount.value === 'day' && this.formFilters?.get('rangeDateStart')?.value && this.formFilters?.get('rangeDateEnd')?.value;
    const monthSelected = this.dayOrMount.value === 'month' && this.selectedMonths.length == 2;

    return daySelected || monthSelected;
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

  printSelectedData() {
    // console.log('Selected Data:', this.selection.selected);
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

  onSelectionChange(event: any): void {
    this.selectedMonths = event.value;

    this.months.forEach(month => {
      if (this.selectedMonths.some(selected => selected.value === month.value)) {
        month.disabled = false;
        month.check = true;
      } else {
        month.disabled = true;
        month.check = false;
      }
    });
  }

  isDisabled(index: any): boolean {
    let value = false;

    if (this.selectedMonths.length) {
      if (this.months[index]?.check && (this.months[index - 1]?.check && this.months[index + 1]?.check)) value = true;
      else if (this.months[index]?.check && (this.months[index - 1]?.check && this.months[index + 1]?.check)) value = true;
      else if (this.months[index]?.check && (!this.months[index - 1] || !this.months[index + 1])) value = true
      else value = false;
    }

    return value
  }

  convertToISO8601(month: string): string {
    const year = new Date().getFullYear();
    const date = moment(`${year}-${month}-01`).startOf('month').toISOString();
    return date;
  }

  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.unsubscribe();
  }
}
