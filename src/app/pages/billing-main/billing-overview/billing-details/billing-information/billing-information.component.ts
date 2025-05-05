import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import * as entity from '../../../billing-model';

@Component({
  selector: 'app-billing-information',
  templateUrl: './billing-information.component.html',
  styleUrl: './billing-information.component.scss',
  standalone: false
})
export class BillingInformationComponent implements OnInit, OnDestroy {
  private onDestroy$ = new Subject<void>();

  @Input() filterData!: entity.FilterBillingDetails

  ngOnInit(): void {
    console.log('Billing information : filterData', this.filterData);
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
