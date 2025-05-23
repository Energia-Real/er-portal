import { AfterViewInit, Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { GeneralFilters, MonthsFilters, UserInfo } from '@app/shared/models/general-models';
import { Observable, Subject, take, takeUntil } from 'rxjs';
import packageJson from '../../../../../package.json';
import { FormBuilder, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { EncryptionService } from '@app/shared/services/encryption.service';
import { setGeneralFilters } from '@app/core/store/actions/filters.actions';
import { selectFilterState } from '@app/core/store/selectors/filters.selector';
import { DataCatalogs } from '@app/shared/models/catalogs-models';

@Component({
  selector: 'app-global-filters',
  standalone: false,
  templateUrl: './global-filters.component.html',
  styleUrl: './global-filters.component.scss',
})
export class GlobalFiltersComponent implements OnInit, AfterViewInit, OnDestroy {
  private onDestroy$ = new Subject<void>();
  version = packageJson.version;


  userInfo!: UserInfo;
  @Output() monthSelected = new EventEmitter<{ month: string; year: number }>();
  @ViewChild(MatMenuTrigger) menuTrigger!: MatMenuTrigger;


  years: { value: string }[] = [
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
    customerName: [''],
    legalName: [''],
    siteName: [''],
    productType: [''],
  });


  constructor(
    private fb: FormBuilder,
    private router: Router,
    private store: Store<{ filters: GeneralFilters }>,
    private encryptionService: EncryptionService,

  ) {
    this.generalFilters$ = this.store.select(state => state.filters);
  }

  ngOnInit(): void {
    this.routeActive = this.router.url.split('?')[0];
    console.log(this.routeActive);

    this.getFilters();
  }


  ngAfterViewInit(): void {
    this.singleMonth.valueChanges.pipe(takeUntil(this.onDestroy$)).subscribe((isSingleMonthSelected) => {
      if (isSingleMonthSelected) {
        this.selectedEndMonth = null;
        this.selectedMonths.pop()
      }
    });
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

  searchWithFilters() {
    const generalFilters: GeneralFilters = {
      startDate: `${this.yearStartSelected}-${this.selectedStartMonth.value}-01`,
      year: this.selectedYearSelect?.value || this.currentYear.toString(),
      endDate: ''
    };

    generalFilters.endDate = !this.selectedEndMonth ? this.getLastDayOfMonth(this.yearStartSelected, +this.selectedStartMonth.value) : this.getLastDayOfMonth(this.yearEndSelected, +this.selectedEndMonth.value);

    console.log('generalFilters', generalFilters);



    this.store.select(selectFilterState).pipe(take(1)).subscribe((currentFiltersState: any) => {
      if (JSON.stringify(currentFiltersState.generalFilters) != JSON.stringify(generalFilters)) {
        this.store.dispatch(setGeneralFilters({ generalFilters }));
        this.updateUrlWithFilters(generalFilters);
      }
    });
  }

  updateUrlWithFilters(generalFilters: GeneralFilters): void {
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

  selectStartMonth(month: MonthsFilters, menuTrigger: MatMenuTrigger): void {
    this.selectedStartMonth = month;
    menuTrigger.closeMenu();
  }

  selectEndMonth(month: MonthsFilters, menuTrigger: MatMenuTrigger): void {
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



  getLastDayOfMonth(year: number, month: number): string {
    const lastDay = new Date(year, month, 0).getDate();
    return `${year}-${month.toString().padStart(2, '0')}-${lastDay}`;
  }


  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
