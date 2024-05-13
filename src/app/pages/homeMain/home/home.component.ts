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
    'siteSaving', 
    'cfeZone', 
    'solarCoverage', 
    'co2Saving'
  ];

  selection = new SelectionModel<entity.PeriodicElement>(true, []);
  Highcharts: typeof Highcharts = Highcharts;


  chartOptions: Highcharts.Options = {
    chart: {
      type: 'column',
      width: 800, // Ancho del gráfico en píxeles
      height: 400 // Altura del gráfico en píxeles
    },
    colors: ['#d9d9d9', '#ee5427', '#57b1b1', '#792430', '#000000'],
    title: {
      text: 'Comparación de Datos'
    },
    xAxis: {
      categories: ['Producto A', 'Producto B', 'Producto C', 'Producto D']
    },
    yAxis: {
      allowDecimals: false,
      min: 0,
      title: {
        text: 'Cantidad'
      }
    },
    tooltip: {
      format: '<b>{point.category}</b><br/>{series.name}: {point.y}<br/>' +
        'Total: {point.stackTotal}'
    },
    plotOptions: {
      column: {
        stacking: 'normal'
      }
    },
    series: [{
      name: 'Ingresos',
      data: [5000, 7000, 3000, 9000]
    }, {
      name: 'Gastos',
      data: [2000, 3000, 4000, 5000]
    }, {
      name: 'Beneficios',
      data: [3000, 4000, -1000, 4000]
    }, {
      name: 'Impuestos',
      data: [-500, -800, -200, -1000]
    }, {
      name: 'Ganancias netas',
      data: [2500, 3200, 1000, 3000]
    }] as any
  };
  

  showLoader: boolean = true;

  constructor(
    private homeService: HomeService,
    private router : Router,
    private notificationService: OpenModalsService
  ) { }

  ngOnInit(): void {
    this.getDataResponse();
  }

  getDataResponse() {
    this.homeService.getDataClients().subscribe({
      next: ( response : entity.DataRespSavingDetails[] ) => {
        console.log('home response', response);
        this.dataSource.data = response
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
