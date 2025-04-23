import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-billing-history',
  templateUrl: './billing-history.component.html',
  styleUrl: './billing-history.component.scss'
})
export class BillingHistoryComponent implements OnInit, OnDestroy {
  private onDestroy$ = new Subject<void>();

  ngOnInit(): void {

  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
