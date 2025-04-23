import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-billing-information',
  templateUrl: './billing-information.component.html',
  styleUrl: './billing-information.component.scss'
})
export class BillingInformationComponent implements OnInit, OnDestroy {
  private onDestroy$ = new Subject<void>();

  ngOnInit(): void {

  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
