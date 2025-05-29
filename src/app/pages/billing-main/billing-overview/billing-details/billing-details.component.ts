import { Component, OnDestroy, OnInit } from '@angular/core';
import { combineLatest, distinctUntilChanged, Observable, Subject, takeUntil } from 'rxjs';
import { BillingService } from '../../billing.service';
import { EncryptionService } from '@app/shared/services/encryption.service';
import { FormBuilder } from '@angular/forms';
import { GeneralFilters } from '@app/shared/models/general-models';
import { Store } from '@ngrx/store';
import { TranslationService } from '@app/shared/services/i18n/translation.service';
import { ConfigGlobalFilters } from '@app/shared/components/global-filters/global-filters-model';
import { BillingOverviewFilterData } from '../../billing-model';

@Component({
  selector: 'app-billing-details',
  templateUrl: './billing-details.component.html',
  styleUrl: './billing-details.component.scss',
  standalone: false
})
export class BillingDetailsComponent implements OnInit, OnDestroy {
  private onDestroy$ = new Subject<void>();

  configGlobalFilters: ConfigGlobalFilters = {
    showDatepicker: true,
    showClientsFilter: true,
    showLegalNamesFilter: true,
    showProductFilter: true,
    clientsIndividual: false,
  }

  generalFilters$!: Observable<GeneralFilters>;
  generalFilters!: GeneralFilters
  filterData!: BillingOverviewFilterData

  constructor(
    private fb: FormBuilder,
    private encryptionService: EncryptionService,
    private moduleServices: BillingService,
    private store: Store<{ filters: GeneralFilters }>,
    private translationService: TranslationService
  ) {
    this.generalFilters$ = this.store.select(state => state.filters);
    combineLatest([
      this.generalFilters$.pipe(distinctUntilChanged()),
    ])
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(([generalFilters]) => this.generalFilters = generalFilters);
  }

  ngOnInit(): void {}

  onFiltersChanged(filters: any) {
    console.log('Filtros aplicados', filters);
    this.filterData = {
      ...filters,
      page: 1,
      pageSize: 10
    }
  }


  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
