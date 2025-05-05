import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { OwlOptions } from 'ngx-owl-carousel-o';

@Component({
    selector: 'app-plants-evenet-summary',
    templateUrl: './plants-evenet-summary.component.html',
    styleUrl: './plants-evenet-summary.component.scss',
    standalone: false
})
export class PlantsEvenetSummaryComponent {


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
  
}
