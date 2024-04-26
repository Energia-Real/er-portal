import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { provideNativeDateAdapter } from '@angular/material/core';
import * as Highcharts from 'highcharts';
import { ViewEncapsulation } from '@angular/core';
import { AuthService } from '@app/auth/auth.service';
import { LayoutModule } from '@app/shared/components/layout/layout.module';
import { Subject } from 'rxjs';
import { MaterialModule } from '@app/shared/material/material.module';
import * as entity from './home-model';
import { Router } from '@angular/router';
import { HomeService } from './home.service';
import { OpenModalsService } from '@app/shared/services/openModals.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';

const ELEMENT_DATA: any[] = [
  { id: 1, name: 'Chedraui Capulhuac', siteSavings: '$31,741', zone: 0, solarCoverage: '33%', savings: '6 tCO2 ' },
  { id: 2, name: 'Chedraui Chamilpa', siteSavings: '$10,259', zone: 0, solarCoverage: '3%', savings: '6 tCO2 ' },
  { id: 3, name: 'Chedraui Pedregal Selecto', siteSavings: '$6,589', zone: 1, solarCoverage: '23%', savings: '9 tCO2 ' },
  { id: 4, name: 'Chedraui JB Lobos Veracruz', siteSavings: '$90,122', zone: 1, solarCoverage: '39%', savings: '9 tCO2 ' },
  { id: 5, name: 'Chedraui Santa Ana', siteSavings: '$1,0811', zone: 0, solarCoverage: '44%', savings: '9 tCO2 ' },
  { id: 6, name: 'Chedraui Test 3', siteSavings: '$12,0107', zone: 1, solarCoverage: '63%', savings: '22 tCO2 ' },
  { id: 7, name: 'Chedraui Chamilpa', siteSavings: '140,067', zone: 1, solarCoverage: '12%', savings: '6 tCO2 ' },
  { id: 8, name: 'Chedraui test 5', siteSavings: '$159,994', zone: 1, solarCoverage: '11%', savings: '9 tCO2 ' },
];

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  imports: [LayoutModule, MaterialModule],
  styleUrl: './home.component.scss',
  providers: [provideNativeDateAdapter()],
  encapsulation: ViewEncapsulation.None
})
export class HomeComponent implements OnInit, OnDestroy {
  private onDestroy = new Subject<void>();
  
  dataSource = new MatTableDataSource<any>([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  totalItems: number = 0;
  pageIndex : number = 0;
  pageSize : number  = 5;
  displayedColumns: string[] = ['select', 'name', 'siteSavings', 'zone', 'solarCoverage', 'savings'];
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
      categories: ['Arsenal', 'Chelsea', 'Liverpool', 'Manchester United']
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

  constructor(
    private authService: AuthService,
    private homeService: HomeService,
    private router: Router,
    private notificationService: OpenModalsService
  ) { }

  ngOnInit(): void {
    this.getDataResponse(1, ' ');
    console.log(this.authService?.getDecryptedUser());
  }

  getDataResponse(page: number, name: string) {
    this.homeService.getDataClients('', this.pageSize, page).subscribe({
      next: (response: any) => {
        console.log('home response', response);
        this.dataSource.data = response?.data || [];
        this.totalItems = response?.totalItems || 0;
        if (this.dataSource.paginator) this.dataSource.paginator.pageSize = this.pageSize;
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
    this.router.navigateByUrl(`/assets/details/65ebc49f8b7d729ccd68896c`)
  }

  getServerData(event?: PageEvent) {
    this.pageSize = event?.pageSize ?? 5;
    this.getDataResponse(event?.pageIndex ?? 1, ' ');
    return event;
  }

  changePage(event:any) {

  }

  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.unsubscribe();
  }
}
