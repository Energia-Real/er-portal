import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import * as entity from '../../../billing-model';
import { BillingService } from '@app/pages/billing-main/billing.service';
import { GeneralPaginatedResponse } from '@app/shared/models/general-models';

@Component({
  selector: 'app-billing-history',
  templateUrl: './billing-history.component.html',
  styleUrl: './billing-history.component.scss'
})
export class BillingHistoryComponent implements OnInit, OnDestroy {
  private onDestroy$ = new Subject<void>();

  @Input() filterData!: entity.FilterBillingDetails

  pageSizeOptions: number[] = [5, 10, 20, 50];
  pageSize: number = 10;
  pageIndex: number = 1;
  totalItems: number = 0;

  bills!: entity.Bill[] ;


  constructor(
    private moduleService: BillingService
  ){
  }



  ngOnInit(): void {
    console.log('Billing history : filterData', this.filterData);
    this.getBillingHistory();
  }

  getBillingHistory(){
    this.moduleService.getBillingHistory(this.filterData).subscribe({
      next: (response: GeneralPaginatedResponse<entity.HistoryBillResponse>) => {
        this.bills = response.data[0].historyBillResponse
        console.log(this.bills)
      },
      error: error => {
        console.log(error);
      }
    })
  }

  getServerData(event: any){
    console.log(event)
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
