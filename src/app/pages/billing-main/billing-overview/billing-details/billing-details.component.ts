import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { BillingService } from '../../billing.service';
import { EncryptionService } from '@app/shared/services/encryption.service';
import { FormBuilder } from '@angular/forms';
import { FilterBillingDetails } from '../../billing-model';

@Component({
  selector: 'app-billing-details',
  templateUrl: './billing-details.component.html',
  styleUrl: './billing-details.component.scss'
})
export class BillingDetailsComponent implements OnInit, OnDestroy {
  private onDestroy$ = new Subject<void>();

  filtersForm = this.fb.group({
    client: [''],
    legal: [''],
    site: [''],
    solar: [''],
  });

  constructor(
    private fb: FormBuilder,
    private encryptionService: EncryptionService,
    private moduleServices: BillingService
  ) { }

  ngOnInit(): void {}

  get filterData(): FilterBillingDetails {
    return this.filtersForm.value as FilterBillingDetails;
  }
  
  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
