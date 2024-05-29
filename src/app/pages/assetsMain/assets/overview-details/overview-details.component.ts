 import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import * as Highcharts from 'highcharts';
import { Subject } from 'rxjs';
import { AssetsService } from '../assets.service';
import * as entity from '../assets-model';
import { OpenModalsService } from '@app/shared/services/openModals.service';
import moment from 'moment';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '@app/auth/auth.service';
import { Mapper } from '../mapper';

@Component({
  selector: 'app-overview-details',
  templateUrl: './overview-details.component.html',
  styleUrl: './overview-details.component.scss'
})
export class OverviewDetailsComponent implements OnInit, OnDestroy {
  private onDestroy = new Subject<void>();

  @Input() assetData!: entity.DataPlant;
  @Input() notData! : boolean;
  @Output() systemSizeValue = new EventEmitter<string>();

  Highcharts: typeof Highcharts = Highcharts;
  private id =''
  public infoTooltip='Info';
  public materialIcon='edit'
  canEdit= false;
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

  constructor(
    private moduleServices : AssetsService,
    private notificationService: OpenModalsService,
    private route: ActivatedRoute,
    private accountService: AuthService
  ) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('assetId')!;
    if (this.assetData?.plantCode && this.assetData?.inverterBrand?.length) this.getDataResponse();
      else this.showAlert = true;
    this.getLocalS();
  }

  getDataResponse() {
    this.moduleServices.getDataRespOverview(this.id).subscribe({
      next: ( response : entity.DataResponseDetailsMapper[] ) => { 
        this.overviewResponse = response
            },
      error: (error) => {
        this.notificationService.notificacion(`Hable con el administrador.`, 'alert');
        console.error(error)
      }
    })
  }

 
  someFunction() {
    console.log('Function executed from the icon click!');
  }

  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.unsubscribe();
  }

  getLocalS(){
    this.accountService.getDecryptedUser().accessTo=='BackOffice' ?  this.canEdit=true: this.canEdit=false; 
  }

  updateCardInfo(event :any){
    let updateData =Mapper.mapToClientData(event)
    this.moduleServices.patchDataPlantOverview(this.id,updateData).subscribe(resp=>{
      console.log(resp.status)
    })
  }
}
