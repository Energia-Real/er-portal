import { Component, OnDestroy, OnInit } from '@angular/core';
import { combineLatest, distinctUntilChanged, Observable, Subject, takeUntil } from 'rxjs';
import { BillingService } from '../../billing.service';
import { EncryptionService } from '@app/shared/services/encryption.service';
import { FormBuilder } from '@angular/forms';
import { FilterBillingDetails } from '../../billing-model';
import { GeneralFilters } from '@app/shared/models/general-models';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-billing-details',
  templateUrl: './billing-details.component.html',
  styleUrl: './billing-details.component.scss'
})
export class BillingDetailsComponent implements OnInit, OnDestroy {
  private onDestroy$ = new Subject<void>();
  generalFilters$!: Observable<GeneralFilters>;
  generalFilters!: GeneralFilters

  filtersForm = this.fb.group({
    customerName: [''],
    legalName: [''],
    siteName: [''],
    productType: [''],
  });

  constructor(
    private fb: FormBuilder,
    private encryptionService: EncryptionService,
    private moduleServices: BillingService,
    private store: Store<{ filters: GeneralFilters }>,
  ) {
    this.generalFilters$ = this.store.select(state => state.filters);
    combineLatest([
      this.generalFilters$.pipe(distinctUntilChanged()),
    ])
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(([generalFilters]) => {
        this.generalFilters = generalFilters;
        //this.getBilling();
      });
  }

  ngOnInit(): void { }

  get filterData(): FilterBillingDetails {
    return {
      ...this.filtersForm.value,
      year:Number( this.generalFilters?.year),
      page:1,
      pageSize:10
    } as FilterBillingDetails;
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
