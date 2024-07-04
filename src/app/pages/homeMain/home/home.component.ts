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
import moment from 'moment';



@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  imports: [CommonModule, LayoutModule, MaterialModule, MessageNoDataComponent, ReactiveFormsModule],
  styleUrl: './home.component.scss',
  providers: [provideNativeDateAdapter()],
  encapsulation: ViewEncapsulation.None
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  private onDestroy = new Subject<void>();
  dataSource = new MatTableDataSource<any>([]);
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

  months: entity.Month[] = [
    { value: 1, viewValue: 'Enero' },
    { value: 2, viewValue: 'Febrero' },
    { value: 3, viewValue: 'Marzo' },
    { value: 4, viewValue: 'Abril' },
    { value: 5, viewValue: 'Mayo' },
    { value: 6, viewValue: 'Junio' },
    { value: 7, viewValue: 'Julio' },
    { value: 8, viewValue: 'Agosto' },
    { value: 9, viewValue: 'Septiembre' },
    { value: 10, viewValue: 'Octubre' },
    { value: 11, viewValue: 'Noviembre' },
    { value: 12, viewValue: 'Diciembre' }
  ];

  currentYear = new Date().getFullYear();
  dayOrMount = new FormControl('month');
  selectedMonths: number[] = [];

  selection = new SelectionModel<entity.PeriodicElement>(true, []);
  Highcharts: typeof Highcharts = Highcharts;

  chartOptions: Highcharts.Options = {
    chart: {
      type: 'column'
    },
    colors: ['#d9d9d9', '#ee5427', '#57b1b1', '#792430', '#000000'],
    title: {
      text: '',
      align: 'left'
    },
    xAxis: {
      categories: []
    },
    yAxis: {
      allowDecimals: false,
      min: 0,
      title: {
        text: ''
      }
    },
    tooltip: {
      format: '<b>{key}</b><br/>{series.name}: {y}<br/>' +
        'Total: {point.stackTotal}'
    },
    plotOptions: {
      column: {
        stacking: 'normal'
      }
    },
    series: [{
      name: 'ICO2',
      data: [3, 5, 1, 13]
    }, {
      name: 'Subtotal ER',
      data: [14, 8, 8, 12]
    }, {
      name: 'Saving (MXN)',
      data: [0, 2, 6, 3]
    }, {
      name: 'Subtotal CFE',
      data: [17, 2, 6, 3]
    }, {
      name: 'CFE Cost w/o Solar',
      data: [0, 2, 6, 3]
    }] as any
  };

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
    private notificationService: OpenModalsService
  ) { }

  ngOnInit(): void {
    this.getDataResponse();
  }

  ngAfterViewInit(): void {
    this.dayOrMount.valueChanges.pipe(takeUntil(this.onDestroy)).subscribe(content => {
      console.log(content);
    })
  }

  getDataResponse() {
    this.getDataClients();
    this.getDataClientsList();
  }

  searchWithFilters() {
    let filters = "";

    // console.log(this.selectedMonths);
    // console.log(this.formFilters.value);
    
    if (this.dayOrMount?.value == 'day') {
      filters += `startDay=${moment(this.formFilters?.get('rangeDateStart')?.value).format('DD/MM/YYYY')}&`,
        filters += `endDate=${moment(this.formFilters?.get('rangeDateEnd')?.value!).format('DD/MM/YYYY')}&`
        filters += `requestType=day`
    } else {
      console.log(this.selectedMonths);
      filters += `startDay=${this.selectedMonths[0]}/${this.currentYear}&endDate=${this.selectedMonths[1]}/${this.currentYear}&`
      filters += `requestType=month`

    }

    console.log(filters);
    this.getDataClients(filters)
    
  }

  onSelectionChange(event: any): void {
    if (event.value.length > 2) event.source.deselect(event.value[2]);
    else this.selectedMonths = event.value;
  }

  isDisabled(month: number): boolean {
    if (this.selectedMonths.length === 0) return false;
    else if (this.selectedMonths.length === 1) return month < this.selectedMonths[0];
    else return !this.selectedMonths.includes(month);
  }

  getDataClients(fitlers?:string) {
    this.homeService.getDataClients(fitlers).subscribe({
      next: (response: entity.DataRespSavingDetailsMapper) => {
        this.dataSource.data = response.data
        this.savingsDetails = response.savingDetails;
        this.dataSource.sort = this.sort;
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

  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.unsubscribe();
  }
}
