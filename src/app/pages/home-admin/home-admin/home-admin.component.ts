import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { OwlOptions } from 'ngx-owl-carousel-o';

@Component({
  selector: 'app-home-admin',
  templateUrl: './home-admin.component.html',
  styleUrl: './home-admin.component.scss'
})
export class HomeAdminComponent {
  data: any = [
    {
      icon: '../../../../../assets/icons/plantType.svg',
      title: 'Plant type',
      description: 'N/A',
    },
    {
      icon: '../../../../../assets/icons/moutingTech.svg',
      title: 'Mounting technology',
      description: 'N/A',
    },
    {
      icon: '../../../../../assets/icons/noOfSite.svg',
      title: 'No of sites',
      description: 'N/A',
    },
    {
      icon: '../../../../../assets/icons/plantTimeZone.svg',
      title: 'Plant time zone',
      description: 'N/A',
    },
    {
      icon: '../../../../../assets/icons/currency.svg',
      title: 'Currency',
      description: 'N/A',
    },
    {
      icon: '../../../../../assets/icons/comssionDate.svg',
      title: 'Commission date',
      description: 'N/A',
    },
    {
      icon: '../../../../../assets/icons/tariff.svg',
      title: 'Tariff',
      description: 'N/A',
    },
    {
      icon: '../../../../../assets/icons/ficed.svg',
      title: 'Ficed tilt anglee',
      description: 'N/A',
    },
  ]

  dataTwo: any = [
    {
      icon: '../../../../../assets/icons/epc.svg',
      title: 'EPC',
      description: 'N/A',
    },
    {
      icon: '../../../../../assets/icons/oym.svg',
      title: 'O&M',
      description: 'N/A',
    },
  ]

  dataThree: any = [
    {
      icon: '../../../../../assets/icons/transformer.svg',
      title: 'Transformer',
      description: 'N/A',
      titleTwo: 'Generic',
      descriptionTwo: 'N/A',
    },
    {
      icon: '../../../../../assets/icons/inverter.svg',
      title: 'Inverter',
      description: 'N/A',
      titleTwo: 'Solis Solis-60K-LV-5G',
      descriptionTwo: 'N/A',
    },
    {
      icon: '../../../../../assets/icons/pvmodule.svg',
      title: 'PV Module',
      description: 'N/A',
      titleTwo: 'Trina Sola',
      descriptionTwo: 'N/A',
      descriptionThree: 'Mono Crystalline Silicon',
    },
  ]

  assetOperations: any = [
    {
      value: '1',
      description: 'Specific power (kW/kWp)'
    },
    {
      value: '2',
      description: 'Active power (kW)'
    },
    {
      value: '3',
      description: 'Irradiance'
    }
  ]

  catSeverety: any = [
    {
      value: '1',
      description: 'Insignificant'
    },
    {
      value: '2',
      description: 'State'
    },
    {
      value: '3',
      description: 'Low'
    },
    {
      value: '4',
      description: 'Medium'
    },
    {
      value: '5',
      description: 'High'
    },
    {
      value: '6',
      description: 'Critical'
    },
  ]

  catGroup: any = [
    {
      value: '1',
      description: 'BreackDown'
    },
    {
      value: '2',
      description: 'Curtailment'
    },
    {
      value: '3',
      description: 'Manual stop'
    },
    {
      value: '4',
      description: 'System OK'
    },
    {
      value: '5',
      description: 'Undefined'
    },
  ]

  catOrder: any = [
    {
      value: '1',
      description: 'Lastest First'
    },
    {
      value: '1',
      description: 'Earliest First'
    },
  ]

  co2Progress: string = '25%'
  assetOperationsSelect: string = '1';

  customOptions: OwlOptions = {
    loop: false,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: true,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 2
      },
      740: {
        items: 3
      },
      940: {
        items: 4
      }
    },
    nav: false
  }

  formFilters = this.fb.group({
    severety: [''],
    group: [''],
    order: [''],
  });


  constructor(
    private fb: FormBuilder,
  ) { }



  onEnergyTypeChange(event: any): void {
    const selectedValue = event.value;
    console.log(selectedValue);
  }
}
