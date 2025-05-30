import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-billing-overview',
  templateUrl: './billing-overview.component.html',
  styleUrl: './billing-overview.component.scss',
  standalone: false
})
export class BillingOverviewComponent implements OnInit, OnDestroy {
  private onDestroy$ = new Subject<void>();

  constructor(
  ) { }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}

