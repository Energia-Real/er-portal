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
  data=[5,4,3]

  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  @ViewChild(MatSort, { static: false }) sort!: MatSort;

  displayedColumns: string[] = [
    'select',
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
        callbacks:{
          label: function(context) {
            const value = Math.abs(context.raw as number);
            return `${context.dataset.label}: ${value}`;
          }
        }
      },
      
      legend: {
        labels: {
          usePointStyle: true,
        },
        position:"bottom",
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
        stacked: true,
        grid: {
          display: false, 
        },
      },
      y: {
        ticks: {
          callback: function(value, index, values) {
            return Math.abs(Number(value)) + ' kWh'; 
          },
        },
        stacked: true,
        grid: {
          display: false,
        },
      },
    },
    backgroundColor: 'rgba(242, 46, 46, 1)',
  };

  months: entity.Month[] = [
    { value: '01', viewValue: 'Enero' },
    { value: '02', viewValue: 'Febrero' },
    { value: '03', viewValue: 'Marzo' },
    { value: '04', viewValue: 'Abril' },
    { value: '05', viewValue: 'Mayo' },
    { value: '06', viewValue: 'Junio' },
    { value: '07', viewValue: 'Julio' },
    { value: '08', viewValue: 'Agosto' },
    { value: '09', viewValue: 'Septiembre' },
    { value: '10', viewValue: 'Octubre' },
    { value: '11', viewValue: 'Noviembre' },
    { value: '12', viewValue: 'Diciembre' }
  ];

  currentYear = new Date().getFullYear();
  dayOrMount = new FormControl('month');
  selectedMonths: any[] = [];
  selectedEndMonth: number = new Date().getMonth() + 1;
  selection = new SelectionModel<entity.PeriodicElement>(true, []);
  allRowsInit=true;

  showLoader: boolean = true;

  dataClientsList: entity.DataRespSavingDetailsList[] = []

  savingsDetails: any = {
    totalEnergyConsumption: 0,
    totalEnergyProduction: 0
  }

  formFilters = this.formBuilder.group({
    status: [{ value: null, disabled: false }],
    agent: [{ value: null, disabled: false }],
    rangeDateStart: [{ value: '', disabled: false }],
    rangeDateEnd: [{ value: '', disabled: false }],
  });

  constructor(
    private homeService: HomeService,
    private router: Router,
    private formBuilder: FormBuilder,
<<<<<<< Updated upstream
    private notificationService: OpenModalsService,
    private formatsService: FormatsService
  ) {
  
  }
=======
    private notificationService: OpenModalsService
  ) {}
>>>>>>> Stashed changes

  ngOnInit(): void {
    this.setMounts();
    this.getDataClientsList();
    this.lineChartData = {
      labels:this.labels,
      datasets: [
        {
          data: [],
          label: 'Energy Production',
          backgroundColor: 'rgba(121, 36, 48, 1)',
          
        },
        {
          data: [].map((item: number)=> -item),
          label: 'Energy Consuption',
          backgroundColor: 'rgba(87, 177, 177, 1)',
          
        }
      ]
    };
  }

  setMounts() {
    this.selectedMonths = ['01', this.selectedEndMonth.toString().padStart(2, '0')];
    this.searchWithFilters()
  }

  ngAfterViewInit(): void {
    this.dayOrMount.valueChanges.pipe(takeUntil(this.onDestroy)).subscribe(content => {
      this.searchWithFilters()
    })

  }

  searchWithFilters() {

    let filters = "";

    if (this.dayOrMount?.value == 'day' && this.formFilters?.get('rangeDateStart')?.value && this.formFilters?.get('rangeDateEnd')?.value) {
      filters += `requestType=Day&`
      filters += `startDate=${moment(this.formFilters?.get('rangeDateStart')?.value).format('MM/DD/YYYY')}&`,
        filters += `endDate=${moment(this.formFilters?.get('rangeDateEnd')?.value!).format('MM/DD/YYYY')}`
      this.getDataClients(filters)

    } else if (this.dayOrMount?.value == 'month' && this.selectedMonths.length) {
      filters += `requestType=Month&`
      filters += `startDate=${this.selectedMonths[0]}/${this.currentYear}&endDate=${this.selectedMonths[1]}/${this.currentYear}`
      this.getDataClients(filters)
    }
  }

  onSelectionChange(event: any): void {
    if (event.value.length > 2) event.source.deselect(event.value[2]);
    else this.selectedMonths = event.value;
  }

  isDisabled(month: any): boolean {
    if (this.selectedMonths.length === 0) return false;
    else if (this.selectedMonths.length === 1) return month < this.selectedMonths[0];
    else return !this.selectedMonths.includes(month);
  }

  getDataClients(fitlers?: string) {
    this.homeService.getDataClients(fitlers).subscribe({
      next: (response: entity.DataRespSavingDetailsMapper) => {
        this.dataSource.data = response.data
        this.savingsDetails = response.savingDetails;
        this.dataSource.sort = this.sort;
        this.selection.clear();
        this.toggleAllRows();
        this.allRowsInit = false;
        
      },
      error: (error) => {
        this.notificationService.notificacion(`Hable con el administrador.`, 'alert')
        console.error(error)
      }
    })
  }

  getDataClientsList() {
    this.homeService.getDataClientsList().subscribe({
      next: (response: entity.DataRespSavingDetailsList[]) => {
        this.dataClientsList = response;
      },
      error: (error) => {
        this.notificationService.notificacion(`Hable con el administrador.`, 'alert')
        console.error(error)
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

  updtChart(){
    if (this.chart) {
      console.log("chart updt")
      let romevingType:any = this.selection.selected;
      let newData = this.mappingData(romevingType);
      this.printSelectedData();
      let itttm=[2,3,4]
      console.log(newData)
      this.lineChartData.labels= newData.labels
      this.lineChartData.datasets[0].data = newData.energyProduction;
      this.lineChartData.datasets[1].data = newData.energyConsumption.map((item: number)=> -item);

      this.chart.update();
    }
  }
  printSelectedData() {
    console.log('Selected Data:', this.selection.selected);
  }

  mappingData(dataSelected: entity.DataRespSavingDetails[]):any{
    let labels= dataSelected.map(item => item.siteName);
    let energyConsumption = dataSelected.map(item =>this.formatsService.homeGraphFormat(item.energyConsumption));
    let energyProduction = dataSelected.map(item =>this.formatsService.homeGraphFormat(item.energyProduction)); 
    return {
      labels:labels,
      energyConsumption:energyConsumption,
      energyProduction:energyProduction
    }
  }

  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.unsubscribe();
  }
}
