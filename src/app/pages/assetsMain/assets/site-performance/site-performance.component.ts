import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import * as entity from '../assets-model';
import { AssetsService } from '../assets.service';
import { OpenModalsService } from '@app/shared/services/openModals.service';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-site-performance',
  templateUrl: './site-performance.component.html',
  styleUrl: './site-performance.component.scss'
})
export class SitePerformanceComponent implements OnInit, OnDestroy {
  private onDestroy = new Subject<void>();

  @Input() assetData!: entity.DataDetailAsset;

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
      categories: ['08/04', '08/04', '08/04', '08/04', '08/04', '08/04', '08/04', '08/04', '08/04']
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
    // series: []
    series: [
      {
      name: '',
      data: [3, 5, 1, 13]
    }, 
    // {
    //   name: '08/04',
    //   data: [14, 8, 8, 12]
    // }, {
    //   name: '08/04',
    //   data: [0, 2, 6, 3]
    // }, {
    //   name: '08/04',
    //   data: [17, 2, 6, 3]
    // }, {
    //   name: '08/04',
    //   data: [0, 2, 6, 3]
    // }
  ] as any
  };

  showAlert: boolean = false

  constructor(
    private assetsService: AssetsService,
    private notificationService: OpenModalsService
  ) { }

  ngOnInit(): void {
    console.log('site-performance');
    this.showAlert = false
    // console.log('site-performance', this.assetData);

  }

  ngOnDestroy(): void {

  }
}
