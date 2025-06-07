import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { GeneralFilters, MonthsFilters, UserInfo } from '@app/shared/models/general-models';
import { combineLatest, map, Observable, startWith, Subject, take, takeUntil } from 'rxjs';
import packageJson from '../../../../../package.json';
import { FormBuilder, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { setGeneralFilters } from '@app/core/store/actions/filters.actions';
import { selectFilterState } from '@app/core/store/selectors/filters.selector';
import { DataCatalogs } from '@app/shared/models/catalogs-models';
import * as entity from './global-filters-model';
import { selectClients, selectClientsIndividual, selectLegalNames, selectProducts } from '../../../core/store/selectors/catalogs.selector';
import * as CatalogActions from '../../../core/store/actions/catalogs.actions';

@Component({
  selector: 'app-global-filters',
  standalone: false,
  templateUrl: './global-filters.component.html',
  styleUrl: './global-filters.component.scss',
})
export class GlobalFiltersComponent implements OnInit, AfterViewInit, OnDestroy, OnChanges {
  private onDestroy$ = new Subject<void>();
  version = packageJson.version;

  clients$ = this.store.select(selectClients);
  legalNames$ = this.store.select(selectLegalNames);
  products$ = this.store.select(selectProducts);
  clientsIndividual$ = this.store.select(selectClientsIndividual);

  @Input() configGlobalFilters!: entity.ConfigGlobalFilters
  @Output() filtersChanged = new EventEmitter<any>();

  userInfo!: UserInfo;
  @Output() monthSelected = new EventEmitter<{ month: string; year: number }>();
  @ViewChild(MatMenuTrigger) menuTrigger!: MatMenuTrigger;

  years: { value: string }[] = [
    { value: '2023' },
    { value: '2024' },
    { value: '2025' },
  ];

  selectedYearSelect: { value: string } | null = null;

  months: MonthsFilters[] = [
    { name: 'Jan', value: '01' }, { name: 'Feb', value: '02' }, { name: 'Mar', value: '03' },
    { name: 'Apr', value: '04' }, { name: 'May', value: '05' }, { name: 'Jun', value: '06' },
    { name: 'Jul', value: '07' }, { name: 'Aug', value: '08' }, { name: 'Sep', value: '09' },
    { name: 'Oct', value: '10' }, { name: 'Nov', value: '11' }, { name: 'Dec', value: '12' }
  ];

  selectedStartMonth: MonthsFilters | any = this.months[5];
  selectedEndMonth: MonthsFilters | null = this.months[6];

  currentYearStart: number = new Date().getFullYear();
  currentYearEnd: number = new Date().getFullYear();

  yearStartSelected: number = 2024
  yearEndSelected: number = 2025

  currentYear = new Date().getFullYear();
  currentMonth = new Date().getMonth() + 1;

  selectedMonths: { name: string; value: string }[] = [];

  singleMonth = new FormControl(false);

  generalFilters$!: Observable<GeneralFilters>;

  routeActive: string = '';

  clientsCatalog!: DataCatalogs[];
  legalNameCatalog!: DataCatalogs[];
  sitesCatalog!: DataCatalogs[];
  productsCatalog!: DataCatalogs[];

  filtersForm = this.fb.group({
    customerName: this.fb.control<string[]>([]),
    legalName: this.fb.control<string[]>([]),
    productType: this.fb.control<string[]>([]),
  });

  filteredLegalNames$!: Observable<any[]>;
  filteredProducts$!: Observable<any[]>;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private store: Store<{ filters: GeneralFilters }>,
  ) {
    this.generalFilters$ = this.store.select(state => state.filters);
    this.clients$ = this.store.select(selectClients);
    this.legalNames$ = this.store.select(selectLegalNames);
    this.products$ = this.store.select(selectProducts);
    this.clientsIndividual$ = this.store.select(selectClientsIndividual);
  }

  ngOnInit(): void {
    this.routeActive = this.router.url.split('?')[0];
    this.initFiltersConfig();
    this.initFilteredLegalNames();
    this.initFilteredProducts();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Check if configGlobalFilters has changed
    if (changes['configGlobalFilters']) {
      console.log('configGlobalFilters changed:', this.configGlobalFilters);
      // Re-initialize filters config when configGlobalFilters changes
      this.initFiltersConfig();
      
      // Force re-render of the component
      setTimeout(() => {
        // This will trigger change detection
      }, 0);
    }
  }

  ngAfterViewInit(): void {
    this.singleMonth.valueChanges.pipe(takeUntil(this.onDestroy$)).subscribe((isSingleMonthSelected) => {
      if (isSingleMonthSelected) {
        this.selectedEndMonth = null;
        this.selectedMonths.pop()
      }
    });

    this.emitOrDispatchFilters()
  }

  initFiltersConfig() {
    const {
      showClientsFilter,
      showLegalNamesFilter,
      showProductFilter,
      clientsIndividual
    } = this.configGlobalFilters ?? {};

    this.getFilters();
    if (clientsIndividual) this.store.dispatch(CatalogActions.loadClientsCatalog());
    if (showClientsFilter || showLegalNamesFilter || showProductFilter) {
      this.store.dispatch(CatalogActions.loadAllCatalogs());
    }
  }

  initFilteredLegalNames() {
    this.filteredLegalNames$ = combineLatest([
      this.filtersForm.get('customerName')!.valueChanges.pipe(
        startWith(this.filtersForm.get('customerName')!.value)
      ),
      this.legalNames$
    ]).pipe(
      map(([selectedClientIds, legalNames]) => {
        if (!selectedClientIds || selectedClientIds.length === 0) return legalNames;
        return legalNames.filter(ln => selectedClientIds.includes(ln.grupoClienteId));
      })
    );
  }

  initFilteredProducts() {
    this.filteredProducts$ = combineLatest([
      this.filtersForm.get('legalName')!.valueChanges.pipe(
        startWith(this.filtersForm.get('legalName')!.value)
      ),
      this.products$
    ]).pipe(
      map(([selectedLegalNames, products]) => {
        if (!selectedLegalNames?.length) {
          this.filtersForm.get('productType')?.setValue([]);
          return products
        }

        const cleanedRfcs = selectedLegalNames.map((rfc: string) => rfc.trim());

        const filtered = products.filter(product =>
          product.rfcRazonSocial.some((rfc: string) => cleanedRfcs.includes(rfc.trim()))
        );

        // Validar si el valor actual ya no es válido
        const selectedProducts = this.filtersForm.get('productType')!.value || [];
        const filteredProductNames = filtered.map(p => p.nombreTipoProyecto);
        const validSelected = selectedProducts.filter((p: string) =>
          filteredProductNames.includes(p)
        );

        if (selectedProducts.length !== validSelected.length) {
          this.filtersForm.get('productType')!.setValue(validSelected);
        }

        return filtered;
      })
    );
  }

  emitOrDispatchFilters() {
    const baseFilters = this.buildBaseFilters();

    if (this.configGlobalFilters?.isLocal) {
      const localFilters = {
        ...baseFilters,
        customerNames: this.filtersForm.value.customerName,
        legalName: this.filtersForm.value.legalName,
        productType: this.filtersForm.value.productType
      };

      this.filtersChanged.emit(localFilters);
    }

    this.store.select(selectFilterState).pipe(take(1)).subscribe((current: any) => {
      if (JSON.stringify(current.generalFilters) !== JSON.stringify(baseFilters)) {
        this.store.dispatch(setGeneralFilters({ generalFilters: baseFilters }));
        this.updateUrlWithFilters(baseFilters);
      }
    });
  }

  buildBaseFilters() {
    const startDate = `${this.yearStartSelected}-${this.selectedStartMonth?.value}-01`;
    const endDate = !this.selectedEndMonth
      ? this.getLastDayOfMonth(this.yearStartSelected, +this.selectedStartMonth?.value)
      : this.getLastDayOfMonth(this.yearEndSelected, +this.selectedEndMonth?.value);

    const baseFilters: any = {
      startDate,
      endDate,
    };

    if (!this.configGlobalFilters?.isLocal) baseFilters.year = this.selectedYearSelect?.value || this.yearStartSelected.toString();

    return baseFilters;
  }

  getFilters() {
    this.generalFilters$.pipe(takeUntil(this.onDestroy$))
      .subscribe((generalFilters: GeneralFilters) => {
        const [startYear, startMonth] = generalFilters.startDate.split('-');
        const [endYear, endMonth] = generalFilters.endDate.split('-');

        this.selectedStartMonth = this.months.find(month => month.value == startMonth)!;
        this.selectedEndMonth = this.months.find(month => month.value == endMonth)!;

        this.yearStartSelected = +startYear;
        this.yearEndSelected = +endYear;

        this.selectedYearSelect = this.years.find(year => year.value == generalFilters.year) || null;
      });
  }

  updateUrlWithFilters(generalFilters: GeneralFilters) {
    const params = new URLSearchParams(window.location.search);

    if (generalFilters.startDate) params.set('startday', generalFilters.startDate);
    if (generalFilters.endDate) params.set('endday', generalFilters.endDate);
    else params.delete('endday');

    const currentUrl = this.router.url.split('?')[0];
    const newUrl = `${currentUrl}?${params.toString()}`;

    // Actualizar la URL solo si ha cambiado
    if (this.router.url !== newUrl) this.router.navigateByUrl(newUrl);
  }

  isMonthDisabledForStart(month: MonthsFilters): boolean {
    const monthNum = +month.value;
    return this.yearStartSelected == this.currentYear && monthNum > this.currentMonth;
  }

  isMonthDisabledForEnd(month: MonthsFilters): boolean {
    const monthNum = +month.value;
    return this.yearEndSelected == this.currentYear && monthNum > this.currentMonth;
  }

  isSameMonthAndYear(month: MonthsFilters): boolean {
    return this.yearStartSelected == this.yearEndSelected &&
      this.selectedStartMonth?.value == month.value;
  }

  isBeforeStartMonth(month: MonthsFilters): boolean {
    if (this.yearStartSelected != this.yearEndSelected || !this.selectedStartMonth) return false;
    const monthNum = +month.value;
    const startMonthNum = +this.selectedStartMonth.value;
    return monthNum < startMonthNum;
  }

  selectStartMonth(month: MonthsFilters, menuTrigger: MatMenuTrigger) {
    this.selectedStartMonth = month;
    menuTrigger.closeMenu();
  }

  selectEndMonth(month: MonthsFilters, menuTrigger: MatMenuTrigger) {
    this.selectedEndMonth = month;
    menuTrigger.closeMenu();
  }

  updateYearSelected(year: number, period: string) {
    if (period == 'start') {
      this.yearStartSelected = year;

      if (year == this.currentYear && this.selectedStartMonth) {
        const monthNum = +this.selectedStartMonth.value;
        if (monthNum > this.currentMonth) this.selectedStartMonth = { name: 'Jan', value: '01' };
      }
    } else {
      this.yearEndSelected = year;
      if (year == this.currentYear && this.selectedEndMonth) {
        const monthNum = +this.selectedEndMonth.value;
        if (monthNum > this.currentMonth) this.selectedEndMonth = { name: this.months[this.currentMonth - 1].name, value: this.months[this.currentMonth - 1].value };
      }
    }
  }

  getLastDayOfMonth(year: number, month: number) {
    const lastDay = new Date(year, month, 0).getDate();
    return `${year}-${month.toString().padStart(2, '0')}-${lastDay}`;
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
