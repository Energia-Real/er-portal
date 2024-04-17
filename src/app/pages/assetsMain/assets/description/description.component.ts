import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import { Subject } from 'rxjs';
import { AssetsService } from '../assets.service';
import * as entity from '../assets-model';
import { OpenModalsService } from '@app/shared/services/openModals.service';

@Component({
  selector: 'app-description',
  templateUrl: './description.component.html',
  styleUrl: './description.component.scss'
})
export class DescriptionComponent implements OnInit, OnDestroy {
  private onDestroy = new Subject<void>();

  @Input() assetData: any;

  public Highcharts: typeof Highcharts = Highcharts;
  public chartOptions: Highcharts.Options = {
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

  public loading = true; 

  constructor(
    private assetsService : AssetsService,
    private notificationService: OpenModalsService
  ) { }

  ngOnInit(): void {
    console.log('description');
    
    this.getDataResponseDescription()
    console.log('assetData: ', this.assetData);
    setTimeout(() => {
      this.loading = false;
    }, 5000); 
  }

  getDataResponseDescription() {
    let objData :entity.PostDataByPlant = {
      brand : 'huawei',
      plantCode : 'NE=33779163'
    };

    this.assetsService.getDataResponseDescription(objData).subscribe({
      next: ( response : entity.DataResponseDescription ) => {
        console.log(response);
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
