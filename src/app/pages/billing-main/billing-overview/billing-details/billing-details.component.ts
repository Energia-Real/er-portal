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
  
  selectedTabIndex: number = 0;

  configGlobalFilters: ConfigGlobalFilters = {
    isLocal: true,
    showDatepicker: true,
    showClientsFilter: true,
    showLegalNamesFilter: true,
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

  ngOnInit(): void {
    // Initial setup is already done with default values
  }

  onFiltersChanged(filters: any) {
    this.filterData = filters;
  }

  // Method to handle tab change events
  onTabChange(index: number) {
    this.selectedTabIndex = index;
    
    // Create a new object to ensure change detection
    const newConfig = {
      isLocal: true,
      showDatepicker: true,
      showClientsFilter: true,
      showLegalNamesFilter: true,
      showProductFilter: this.selectedTabIndex !== 0 // Hide product filter only when index is 0
    };
    
    // Update the configGlobalFilters with the new object
    this.configGlobalFilters = newConfig;
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
