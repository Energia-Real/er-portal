 import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import { Subject } from 'rxjs';
import { AssetsService } from '../assets.service';
import * as entity from '../assets-model';
import { OpenModalsService } from '@app/shared/services/openModals.service';
import moment from 'moment';

@Component({
  selector: 'app-overview-details',
  templateUrl: './overview-details.component.html',
  styleUrl: './overview-details.component.scss'
})
export class OverviewDetailsComponent implements OnInit, OnDestroy {
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

  overviewResponse : any = []
  showAlert : boolean = false

  objTest:any = {
    "success": true,
    "errorMessage": null,
    "errorCode": 200,
    "data": [
        {
            "title": "Install capacity (AC)",
            "value": "8127.8"
        },
        {
            "title": "Install capacity (DC)",
            "value": "1717.5"
        }
    ]
}

objTest2 = [
  {
      "title": "Last connection timeStamp",
      "value": "05/03/2024 23:01:16"
  },
  {
      "title": "Life Time Energy Production",
      "value": "1025.0700000000002"
  },
  {
      "title": "Life Time Energy Consumption (CFE)",
      "value": "0"
  },
  {
      "title": "Avoided Emmisions (tCO2e)",
      "value": "0.4489806600000001"
  },
  {
      "title": "Energy Coverage",
      "value": "Infinity"
  },
  {
      "title": "Coincident Solar Consumption",
      "value": "0"
  }
]

  constructor(
    private assetsService : AssetsService,
    private notificationService: OpenModalsService
  ) { }

  ngOnInit(): void {
    if (this.assetData?.plantCode && this.assetData?.inverterBrand?.length) this.getDataResponse()
      else this.showAlert = true
  }

  getDataResponse() {
    let objData :entity.PostDataByPlant = {
      brand : this.assetData.inverterBrand[0],
      plantCode : this.assetData.plantCode
    };

    this.assetsService.getDataRespOverview(objData).subscribe({
      next: ( response : entity.DataResponseDetailsMapper[] ) => {
        this.overviewResponse = response;
      },
      error: (error) => {
        this.notificationService.notificacion(`Hable con el administrador.`, 'alert')
        console.error(error)
      }
    })
  }

  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.unsubscribe();
  }
}
