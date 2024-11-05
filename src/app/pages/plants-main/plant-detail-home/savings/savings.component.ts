import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import * as entity from '../../plants-model';
import { Subject } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import Highcharts from 'highcharts';
import { PlantsService } from '../../plants.service';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-savings',
  templateUrl: './savings.component.html',
  styleUrl: './savings.component.scss'
})
export class SavingsComponent implements OnInit, OnDestroy {
  private onDestroy$ = new Subject<void>();

  @Input() plantData: entity.DataPlant | any;
  @Input() notData!: boolean;
  showAlert: boolean = false;
  Highcharts: typeof Highcharts = Highcharts;
  dots = Array(3).fill(0);

  siteDetails = {
    firstTwo: [{
      title: 'CFE Subtotal',
      description: '$603,068',
      icon: '../../../../../assets/icons/cfe-subtotal.png'
    },
    {
      title: 'ER Subtotal',
      description: '$138,090',
      icon: '../../../../../assets/icons/er-subtotal.png'
    },
    {
      title: 'ER + CFE Subtotal',
      description: '$741,156',
      icon: '../../../../../assets/icons/ercfe-subtotal.png'
    },
    {
      title: 'Expenditure without ER',
      description: '$880,636',
      icon: '../../../../../assets/icons/expenditure.png'
    },],

    remaining: [
      {
        title: 'Savings',
        description: '$136,477',
      icon: '../../../../../assets/icons/saving.png'
      },
    ]
  }


  // ]

  // dataDummy!: entity.DataResponseMapper;


  constructor(
    private sanitizer: DomSanitizer,
    private mopduleService: PlantsService,
    private store: Store
  ) {

  }

  ngOnInit(): void {

    // setTimeout(() => {
    //   this.siteDetails.firstTwo.push(this.dataDummy.slice(0, 4))
    //   this.siteDetails.remaining.push(this.dataDummy.slice(4))
    // }, 100);

    // console.log(this.siteDetails);

    // if (this.notData) this.showAlert = true;
    // this.getSavings(this.plantData?.id)
  }

  getSavings(plantCode: string) {
    // this.siteDetails.firstTwo = this.dataDummy.slice(0, 4)
    // this.siteDetails.remaining = this.dataDummy.slice(4)
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.unsubscribe();
  }
}
