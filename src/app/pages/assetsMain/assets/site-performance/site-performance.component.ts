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



  private onDestroy = new Subject<void>();
 // @ViewChild('chart') chart: any;
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
    this.showAlert = false;
    this.fechaHoy = new Date(this.fechaHoy.getFullYear(), 0, 1);
    this.assetsService.getProyectResume(this.assetData.inverterBrand[0],this.assetData.plantCode).subscribe(response =>{
      console.log(response); // Añadir esto para verificar la estructura de los datos
      
     
     


      // Verificar si la respuesta contiene la propiedad monthresume
      const monthResume = response[0]?.monthresume;
      if (!monthResume) {
        console.error('monthresume is undefined');
        return;
      }
      const inverterPowerData = monthResume.map(item => item.inverterPower);
     

      //HighChartsPIE
      const seriesData = monthResume.map((item, index) => {
        const month = `Month ${index + 1}`;
        return { name: month, y: item.inverterPower };
      });
  
      console.log(seriesData, 'inverter mapped');
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
        labels:monthResume.map((_, index) => `Month ${index + 1}`),
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
  
 
  ngAfterViewInit(): void {
    
  }

  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.unsubscribe();
  }

 
}
