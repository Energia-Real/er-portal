import { AfterViewChecked, AfterViewInit, Component, OnDestroy, ViewChild } from '@angular/core';
import * as entity from '../billing-model';
import { combineLatest, debounceTime, distinctUntilChanged, Observable, Subject, Subscription, takeUntil } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Store } from '@ngrx/store';
import { OpenModalsService } from '@app/shared/services/openModals.service';
import { Router } from '@angular/router';
import { BillingService } from '../billing.service';
import { selectPageIndex, selectPageSize } from '@app/core/store/selectors/paginator.selector';
import { FormControl } from '@angular/forms';
import { updatePagination } from '@app/core/store/actions/paginator.actions';
import { FilterState, GeneralFilters } from '@app/shared/models/general-models';

@Component({
  selector: 'app-billing',
  templateUrl: './billing.component.html',
  styleUrl: './billing.component.scss'
})
export class BillingComponent implements OnDestroy, AfterViewChecked, AfterViewInit {
  private onDestroy$ = new Subject<void>();

  generalFilters$!: Observable<FilterState['generalFilters']>;

  dataSource = new MatTableDataSource<any>([]);
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;
  pageSizeOptions: number[] = [5, 10, 20, 50];
  pageSize: number = 5;
  pageIndex: number = 1;
  totalItems: number = 0;
  displayedColumns: string[] = [
    'rpu',
    'clientName',
    'plantName',
    'year',
    'month',
    'energyGeneration',
    'rate',
    'amount',
    'amountWithIva',
  ];
  pageSizeSub!: Subscription;
  pageIndexSub!: Subscription;

  formatTimer: any;

  modifiedElements: any[] = [];

  searchBar = new FormControl('');

  generalFilters!: GeneralFilters

  ngAfterViewChecked() {
    if (this.paginator) this.paginator.pageIndex = this.pageIndex - 1;
    else console.error('Paginator no está definido');
  }

  constructor(
    private store: Store<{ filters: FilterState }>,
    private notificationService: OpenModalsService,
    private router: Router,
    private moduleServices: BillingService,
  ) {
    this.generalFilters$ = this.store.select(state => state.filters.generalFilters);

    combineLatest([
      this.generalFilters$.pipe(distinctUntilChanged()),
      this.store.select(selectPageSize).pipe(distinctUntilChanged()),
      this.store.select(selectPageIndex).pipe(distinctUntilChanged())
    ])
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(([generalFilters, pageSize, pageIndex]) => {
        this.generalFilters = generalFilters;
        this.pageSize = pageSize;
        this.pageIndex = pageIndex + 1;

        if (this.paginator) {
          this.paginator.pageSize = pageSize;
          this.paginator.pageIndex = pageIndex;
        }

        this.getBilling();
      });
  }

  ngAfterViewInit(): void {
    this.searchBar.valueChanges.pipe(debounceTime(500), takeUntil(this.onDestroy$), distinctUntilChanged()).subscribe(content => {
      this.getBilling(content!);
    });
  }

  getBilling(searchTerm: string = '') {
    const filters = {
      plantName: searchTerm,
      pageSize: this.pageSize,
      page: this.pageIndex,
      ...this.generalFilters
    };

    this.moduleServices.getBillingData(filters).subscribe({
      next: (response: entity.DataBillingTableMapper) => {
        this.dataSource.data = response?.data;
        this.totalItems = response?.totalItems;
        this.dataSource.sort = this.sort;
        this.pageIndex = filters.page;
      },
      error: error => {
        this.notificationService.notificacion(`Talk to the administrator.`, 'alert');
        console.log(error);
      }
    });
  }

  updateModifiedElements() {
    this.modifiedElements.forEach(data => {
      delete data.formattedGeneratedEnergyKwh;
      delete data.originalGeneratedEnergyKwh;
      delete data.formattedAmount;
      delete data.formattedAmountWithIva;
      delete data.formattedRate;
      delete data.formattedMonth;
    });

    this.moduleServices.saveBillingTableData(this.modifiedElements).subscribe({
      next: (response: any) => {
        console.log(response?.data);
      },
      error: error => {
        console.log(error);
      }
    });
  }

  handleInput(event: any, element: any, isBlurEvent: boolean = false) {
    const cleanedValue: any = this.cleanFormattedValue(event.target.value);

    element.generatedEnergyKwh = cleanedValue;
    element.formattedGeneratedEnergyKwh = this.getFormattedValue(cleanedValue);

    if (isBlurEvent) event.target.value = element.formattedGeneratedEnergyKwh;
    this.trackChanges(element);
  }

  trackChanges(element: any) {
    const index = this.modifiedElements.findIndex(el => el.externalId === element.externalId);

    const cleanedOriginalEnergy = this.cleanFormattedValue(element.originalGeneratedEnergyKwh);
    const cleanedCurrentEnergy = this.cleanFormattedValue(element.generatedEnergyKwh);

    const isEnergyChanged = cleanedOriginalEnergy !== cleanedCurrentEnergy;
    const isEnergyCleared = cleanedCurrentEnergy === null;

    if (isEnergyCleared && index !== -1) this.modifiedElements.splice(index, 1);
    else if (isEnergyChanged && index === -1) this.modifiedElements.push({ ...element });
    else if (!isEnergyChanged && index !== -1) this.modifiedElements.splice(index, 1);
    else if (isEnergyChanged && index >= 0) this.modifiedElements[index] = { ...element };
  }

  cleanFormattedValue(value: any): number | null {
    if (!value) return null;
    const cleanedValue = value.toString().replace(/[^\d.-]/g, '');
    const parsedValue = parseFloat(cleanedValue);
    return isNaN(parsedValue) ? null : parsedValue;
  }

  getFormattedValue(value: string): string {
    const numberValue = parseFloat(value);
    return !isNaN(numberValue)
      ? numberValue.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })
      : '';
  }

  navigate(link: string) {
    this.router.navigateByUrl(link);
  }

  getServerData(event: PageEvent): void {
    if (event.pageSize !== this.pageSize || event.pageIndex !== this.pageIndex - 1) {
      this.store.dispatch(updatePagination({ pageIndex: event.pageIndex, pageSize: event.pageSize }));
    }
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.unsubscribe();
  }
}
