import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { provideNativeDateAdapter } from '@angular/material/core';
import * as Highcharts from 'highcharts';
import { ViewEncapsulation } from '@angular/core';
import { LayoutModule } from '@app/shared/components/layout/layout.module';
import { Subject } from 'rxjs';
import { MaterialModule } from '@app/shared/material/material.module';
import * as entity from './home-model';
import { Router } from '@angular/router';
import { HomeService } from './home.service';
import { OpenModalsService } from '@app/shared/services/openModals.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  imports: [CommonModule, LayoutModule, MaterialModule],
  styleUrl: './home.component.scss',
  providers: [provideNativeDateAdapter()],
  encapsulation: ViewEncapsulation.None
})
export class HomeComponent implements OnInit, OnDestroy {
  private onDestroy = new Subject<void>();
  dataSource = new MatTableDataSource<any>([]);

  displayedColumns: string[] = [
    'select',
    'siteName', 
    'energyConsumption', 
    'energyProduction', 
    'solarCoverage', 
    'co2Saving'
  ];

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

  dataClientsList : entity.DataRespSavingDetailsList[] = []

  savingsDetails:any = {
    totalEnergyConsumption : 0,
    totalEnergyProduction : 0
  }

  constructor(
    private homeService: HomeService,
    private router : Router,
    private notificationService: OpenModalsService
  ) { }

  ngOnInit(): void {
    this.getDataResponse();
  }

  getDataResponse() {
    this.getDataClients();
    this.getDataClientsList();
  }

  getDataClients() {
    this.homeService.getDataClients().subscribe({
      next: ( response : entity.DataRespSavingDetailsMapper ) => {
        this.dataSource.data = response.data
        this.savingsDetails = response.savingDetails;
        this.showLoader = false;
      },
      error: (error) => {
        this.notificationService.notificacion(`Hable con el administrador.`, 'alert')
        this.showLoader = false;
        console.error(error)
      }
    })
  }
 
  getDataClientsList() {
    this.homeService.getDataClientsList().subscribe({
      next: ( response : entity.DataRespSavingDetailsList[] ) => {
        console.log(response);
        this.dataClientsList = response;
        this.showLoader = false;
      },
      error: (error) => {
        this.notificationService.notificacion(`Hable con el administrador.`, 'alert')
        this.showLoader = false;
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

  goDetails(id:string) {
    this.router.navigateByUrl(`/assets/details/${id}`)
  }

  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.unsubscribe();
  }
}
