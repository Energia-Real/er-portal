import { Component, ViewEncapsulation } from '@angular/core';
import { provideNativeDateAdapter } from '@angular/material/core';
import { LayoutModule } from '@app/shared/components/layout/layout.module';
import { MaterialModule } from '@app/shared/material/material.module';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-detail-site-name',
  standalone: true,
  templateUrl: './detail-site-name.component.html',
  styleUrl: './detail-site-name.component.scss',
  imports: [LayoutModule, MaterialModule],
  providers: [provideNativeDateAdapter()],
  encapsulation: ViewEncapsulation.None

})
export class DetailSiteNameComponent {
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
      // categories: ['Arsenal', 'Chelsea', 'Liverpool', 'Manchester United']
    },
    yAxis: {
      allowDecimals: false,
      min: 0,
      title: {
        text: ''
      }
    },
    tooltip: {
      format: ''
      // format: '<b>{key}</b><br/>{series.name}: {y}<br/>' +
      //   'Total: {point.stackTotal}'
    },
    plotOptions: {
      column: {
        stacking: 'normal'
      }
    },
    series: [
      {
      name: '',
      data: [3, 5, 1, 13]
    }, {
      name: '',
      data: [14, 8, 8, 12]
    }, {
      name: '',
      data: [0, 2, 6, 3]
    }, {
      name: '',
      data: [17, 2, 6, 3]
    }, {
      name: '',
      data: [0, 2, 6, 3]
    }
  ] as any
  };
}
