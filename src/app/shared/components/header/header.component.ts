import { Component, EventEmitter, Input, OnDestroy, Output, ViewChild } from '@angular/core';

import { Router } from '@angular/router';
import { AuthService } from '@app/auth/auth.service';
import { Subject, takeUntil } from 'rxjs';
import packageJson from '../../../../../package.json';
import { setFilters, setFiltersBatu, setFiltersSolarCoverage } from '@app/core/store/actions/filters.actions';
import { Store } from '@ngrx/store';
import { FilterState, UserV2 } from '@app/shared/models/general-models';
import { selectFilters } from '@app/core/store/selectors/filters.selector';
import { MatMenuTrigger } from '@angular/material/menu';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnDestroy {
  private onDestroy$ = new Subject<void>();

  userInfo!: UserV2
  @Input() routeActive = '';
  @Output() monthSelected = new EventEmitter<{ month: string, year: any }>();
  @ViewChild(MatMenuTrigger) menuTrigger!: MatMenuTrigger;

  version = packageJson.version;

  months: { name: string, value: string }[] = [
    { name: 'Jan', value: '01' },
    { name: 'Feb', value: '02' },
    { name: 'Mar', value: '03' },
    { name: 'Apr', value: '04' },
    { name: 'May', value: '05' },
    { name: 'Jun', value: '06' },
    { name: 'Jul', value: '07' },
    { name: 'Aug', value: '08' },
    { name: 'Sep', value: '09' },
    { name: 'Oct', value: '10' },
    { name: 'Nov', value: '11' },
    { name: 'Dec', value: '12' },
  ];

  selectedStartMonth: any;
  selectedEndMonth: any;

  currentYear = new Date().getFullYear().toString().slice(-2);
  currentYearComplete = new Date().getFullYear();

  selectedMonth: { name: string; value: string } | null = null;

  isOpen:boolean = false;

  selectedMonths: any[] = []

  currentFilters: any = {};
  currentFiltersBatu: any = {};
  currentFiltersSolarCoverage: any = {};

  constructor(
    private accountService: AuthService,
    private router: Router,
    private store: Store<{ filters: FilterState }>
  ) { }

  ngOnInit(): void {
    this.store.select(selectFilters).pipe(takeUntil(this.onDestroy$)).subscribe((filtersState: any) => {
      if (filtersState && filtersState.months.length > 0) {
        const formattedSelectedMonths = this.selectedMonths.map(month => `${this.currentYearComplete}-${month.value}-01`);
        const isSameFilters = JSON.stringify(filtersState?.months) === JSON.stringify(formattedSelectedMonths);

        if (!isSameFilters) {
          this.selectedMonths = this.months.filter(month =>
            filtersState.months.includes(`${this.currentYear}-${month.value}-01`)
          );
          this.selectedStartMonth = this.selectedMonths[0];
          this.selectedEndMonth = this.selectedMonths[this.selectedMonths.length - 1];
        }
      } else {
        this.setDefaultMonths();
      }
    });

    this.getInfoUser();

  }

  setDefaultMonths() {
    this.selectedStartMonth = this.months[5];
    this.selectedEndMonth = this.months[6];
    this.updateSelectedMonths();
  }

  selectStartMonth(month: any, menuTrigger: MatMenuTrigger): void {
    this.selectedStartMonth = month;
    this.updateSelectedMonths();
    menuTrigger.closeMenu();
  }

  selectEndMonth(month: any, menuTrigger: MatMenuTrigger): void {
    this.selectedEndMonth = month;
    this.updateSelectedMonths();
    menuTrigger.closeMenu();
  }

  updateSelectedMonths() {
    if (this.selectedStartMonth && this.selectedEndMonth) {
      const startIndex = this.months.findIndex(m => m.value === this.selectedStartMonth.value);
      const endIndex = this.months.findIndex(m => m.value === this.selectedEndMonth.value);
      if (startIndex !== -1 && endIndex !== -1) {
        const selectedRange = this.months.slice(
          Math.min(startIndex, endIndex),
          Math.max(startIndex, endIndex) + 1
        );
        this.selectedMonths = [...selectedRange];
      }
    }
    this.searchWithFilters();
  }

  searchWithFilters() {
    let filtersBatu: any = {};
    let filters: any = {};
    let filtersSolarCoverage: any = {
      brand: "huawei",
      clientName: "Merco",
      months: []
    };

    if (this.selectedMonths?.length) {
      const formattedSelectedMonths = this.selectedMonths.map(month => `${this.currentYearComplete}-${month.value}-01`);

      filters.requestType = 'Month';
      filters.months = formattedSelectedMonths;

      filtersSolarCoverage.requestType = 2;
      filtersSolarCoverage.months = formattedSelectedMonths;
      filtersBatu.months = this.selectedMonths.map(month => `${this.currentYearComplete}-${month.value}`);

      this.store.dispatch(setFilters({ filters }));
      this.store.dispatch(setFiltersBatu({ filtersBatu }));
      this.store.dispatch(setFiltersSolarCoverage({ filtersSolarCoverage }));

      console.log('Nuevos filtros despachados:', filters);
      console.log('Nuevos filtrosBatu despachados:', filtersBatu);
      console.log('Nuevos filtrosSolarCoverage despachados:', filtersSolarCoverage);
    }
  }

  signOut() {
    localStorage.removeItem('userEnergiaReal');
    this.router.navigate(['/account/login']);
  }

  getInfoUser() {
    this.accountService.getInfoUser().subscribe((data: UserV2) => {
      this.userInfo = data;
    })
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.unsubscribe();
  }
}
