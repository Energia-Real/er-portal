import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import * as entity from '../../../billing-model';

@Component({
  selector: 'app-sites',
  templateUrl: './sites.component.html',
  styleUrl: './sites.component.scss'
})
export class SitesComponent implements OnInit, OnDestroy {
  private onDestroy$ = new Subject<void>();

  @Input() filterData!: entity.FilterBillingDetails

  ngOnInit(): void {
    console.log('Sites : filterData', this.filterData);
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
