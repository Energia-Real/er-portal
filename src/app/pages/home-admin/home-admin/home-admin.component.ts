import { Component } from '@angular/core';

@Component({
  selector: 'app-home-admin',
  templateUrl: './home-admin.component.html',
  styleUrl: './home-admin.component.scss'
})
export class HomeAdminComponent {
  data:any = [
    {
      icon : '../../../../../assets/icons/plantType.svg',
      title: 'Plant type',
      description: 'N/A',
    },
    {
      icon : '../../../../../assets/icons/moutingTech.svg',
      title: 'Mounting technology',
      description: 'N/A',
    },
    {
      icon : '../../../../../assets/icons/noOfSite.svg',
      title: 'No of sites',
      description: 'N/A',
    },
    {
      icon : '../../../../../assets/icons/plantTimeZone.svg',
      title: 'Plant time zone',
      description: 'N/A',
    },
    {
      icon : '../../../../../assets/icons/currency.svg',
      title: 'Currency',
      description: 'N/A',
    },
    {
      icon : '../../../../../assets/icons/comssionDate.svg',
      title: 'Commission date',
      description: 'N/A',
    },
    {
      icon : '../../../../../assets/icons/tariff.svg',
      title: 'Tariff',
      description: 'N/A',
    },
    {
      icon : '../../../../../assets/icons/ficed.svg',
      title: 'Ficed tilt anglee',
      description: 'N/A',
    },
  ]
  
  dataTwo:any = [
    {
      icon : '../../../../../assets/icons/epc.svg',
      title: 'EPC',
      description: 'N/A',
    },
    {
      icon : '../../../../../assets/icons/oym.svg',
      title: 'O&M',
      description: 'N/A',
    },
  ]
  
  dataThree:any = [
    {
      icon : '../../../../../assets/icons/transformer.svg',
      title: 'Transformer',
      description: 'N/A',
      titleTwo: 'Generic',
      descriptionTwo: 'N/A',
    },
    {
      icon : '../../../../../assets/icons/inverter.svg',
      title: 'Inverter',
      description: 'N/A',
      titleTwo: 'Solis Solis-60K-LV-5G',
      descriptionTwo: 'N/A',
    },
    {
      icon : '../../../../../assets/icons/pvmodule.svg',
      title: 'PV Module',
      description: 'N/A',
      titleTwo: 'Trina Sola',
      descriptionTwo: 'N/A',
      descriptionThree: 'Mono Crystalline Silicon',
    },
  ]
}
