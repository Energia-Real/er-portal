import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import * as entity from '../assets-model';
import { AssetsService } from '../assets.service';
import { OpenModalsService } from '@app/shared/services/openModals.service';
import * as Highcharts from 'highcharts';
import { FormBuilder } from '@angular/forms';
import { ChartConfiguration, ChartOptions, ChartType } from "chart.js";




@Component({
  selector: 'app-site-performance',
  templateUrl: './site-performance.component.html',
  styleUrl: './site-performance.component.scss'
})
export class SitePerformanceComponent implements OnInit, OnDestroy {
  
  public lineChartData!: ChartConfiguration<'bar'>['data'];
  public lineChartOptions: ChartOptions<'bar'> = {
    responsive: false
  };
  
  public lineChartLegend = true;

  public chart: any;

  graphicsType: 'pie' | 'bars'= 'bars';

  projectStatus!: entity.ProjectStatus[];



  private onDestroy = new Subject<void>();
  @Input() assetData!: entity.DataPlant;


  //highchart
  Highcharts: typeof Highcharts = Highcharts;
  chartOptions!: Highcharts.Options;



  fechaHoy = new Date();

  formFilters = this.formBuilder.group({
    start: [{ value: '', disabled: false }],
    end: [{ value: '', disabled: false }],
  });

  showAlert: boolean = false;
  displayChart: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private assetsService: AssetsService,
  ) {

   
   }

  ngOnInit(): void {
    let dates = this.getFormattedDates();
    this.getMonthResume( dates.fourMonthsAgo,dates.today,);
    this.formFilters.valueChanges.subscribe(values => {
      this.onFormValuesChanged(values);
    });
    this.showAlert = false;
    this.fechaHoy = new Date(this.fechaHoy.getFullYear(), 0, 1);
    this.getStatus();
   
  }
  
 
  ngAfterViewInit(): void {
  }

  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.unsubscribe();
  }


  onFormValuesChanged(values: any) {
    console.log('Valores del formulario cambiaron:', values);
    if(values.end!='' && values.start!=''){
      console.log('send values');
      this.getMonthResume(values.start, values.end);
    }
    
  }

  getMonthResume(startDate:Date, endDate:Date){
    this.assetsService.getProyectResume(this.assetData.inverterBrand[0],this.assetData.plantCode,startDate,endDate).subscribe(response =>{
      console.log(response);

      const monthResume = response[0]?.monthresume;
      if (!monthResume) {
        console.error('monthresume is undefined');
        return;
      }
      const inverterPowerData = monthResume.map(item => item.inverterPower);
     

      //HighChartsPIE
      const seriesData = monthResume.map((item) => {
        let date = new Date(item.collectTime);
        let monthName = new Intl.DateTimeFormat('es-ES', { month: 'long' }).format(date);
        return { name: monthName, y: item.inverterPower };
      });
  
      this.chartOptions = {
        chart: {
          type: 'pie'
        },
        title: {
          text: 'Inverter Power Data'
        },
        series: [{
          type: 'pie',
          name: 'Inverter Power',
          data: seriesData
        }],
        plotOptions: {
          pie: {
            dataLabels: {
              enabled: true,
              format: '<b>{point.name}</b>: {point.y}'
            }
          }
        }
      };

      this.lineChartData={
        labels:monthResume.map((item) =>{
          let date = new Date(item.collectTime);
          let monthName = new Intl.DateTimeFormat('es-ES', { month: 'long' }).format(date);
          return monthName
        }),
        datasets:[
          {
            data:inverterPowerData,
            label:'Inverter Power',
            backgroundColor:'rgba(238, 84, 39, 0.4)'
          }
        ]
      }
      this.displayChart=true;
    }, error => {
      console.error('Error fetching data from endpoint', error);
    } 
    )
  }

   getFormattedDates() {
    const today = new Date();
    const firstDayOfCurrentMonth = new Date(today.getFullYear(), today.getMonth(), - 1);
    const fourMonthsAgo = new Date(today.setMonth(today.getMonth() - 5));
    const firstDayOfFourMonthsAgo = new Date(fourMonthsAgo.getFullYear(), fourMonthsAgo.getMonth(), 1);
    return {
      today: firstDayOfCurrentMonth,
      fourMonthsAgo: firstDayOfFourMonthsAgo
    };
  }

  getStatus() {
    this.assetsService.getDataRespStatus().subscribe(resp =>{
      this.projectStatus = resp 
    })
  }
  

 
}
