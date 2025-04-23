import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-billing-details',
  templateUrl: './billing-details.component.html',
  styleUrl: './billing-details.component.scss'
})
export class BillingDetailsComponent implements OnInit, OnDestroy {
  private onDestroy$ = new Subject<void>();

  ngOnInit(): void {

  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
