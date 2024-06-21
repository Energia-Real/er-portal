import { Component, Input, OnInit } from '@angular/core';
import * as entity from '../assets-model';
import Highcharts from 'highcharts';

@Component({
  selector: 'app-instalation-details',
  templateUrl: './instalation-details.component.html',
  styleUrl: './instalation-details.component.scss'
})
export class InstalationDetailsComponent implements OnInit{
  @Input() assetData!: entity.DataPlant;
  @Input() notData! : boolean;

  showAlert: boolean = false
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

  
  ngOnInit(): void {
    if (this.notData) this.showAlert = true;
  }
}
