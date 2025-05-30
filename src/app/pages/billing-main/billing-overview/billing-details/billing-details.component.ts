import { Component, OnDestroy, OnInit } from '@angular/core';
import { combineLatest, distinctUntilChanged, Observable, Subject, takeUntil } from 'rxjs';
import { GeneralFilters } from '@app/shared/models/general-models';
import { Store } from '@ngrx/store';
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
    isLocal:true,
    showDatepicker: true,
    showClientsFilter: true,
    showLegalNamesFilter: true,
    showProductFilter: true,
  }

  generalFilters$!: Observable<GeneralFilters>;
  generalFilters!: GeneralFilters
  filterData!: BillingOverviewFilterData

  constructor(
    private store: Store<{ filters: GeneralFilters }>,
  ) {
    this.generalFilters$ = this.store.select(state => state.filters);
    combineLatest([
      this.generalFilters$.pipe(distinctUntilChanged()),
    ])
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(([generalFilters]) => this.generalFilters = generalFilters);
  }

  ngOnInit(): void { }

  onFiltersChanged(filters: any) {
    this.filterData = filters;
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
