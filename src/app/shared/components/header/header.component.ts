import { Component, EventEmitter, Input, OnDestroy, Output, ViewChild } from '@angular/core';

import { Router } from '@angular/router';
import { AuthService } from '@app/auth/auth.service';
import { Subject, takeUntil } from 'rxjs';
import packageJson from '../../../../../package.json';
import { FormBuilder } from '@angular/forms';
import { setFilters, setFiltersBatu, setFiltersSolarCoverage } from '@app/core/store/actions/filters.actions';
import { Store } from '@ngrx/store';
import { FilterState } from '@app/shared/models/general-models';
import { selectFilters } from '@app/core/store/selectors/filters.selector';
import { MatMenuTrigger } from '@angular/material/menu';

interface User {
  id: string,
  email: string,
  persona: {
    id: string,
    nombres: string,
    apellidos: string
  },
  clientes: null,
  accessTo: string
}
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnDestroy {
  private onDestroy$ = new Subject<void>();

  userInfo: any = {};
  @Input() routeActive = '';

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
  @Output() monthSelected = new EventEmitter<{ month: string, year: any }>();
  @ViewChild(MatMenuTrigger) menuTrigger!: MatMenuTrigger;
  isOpen = false;

  selectedMonths: any[] = []

  constructor(
    private accountService: AuthService,
    private router: Router,
    private store: Store<{ filters: FilterState }>
  ) { }

  ngOnInit(): void {
    this.store.select(selectFilters).pipe(takeUntil(this.onDestroy$)).subscribe(filtersState => {
      if (filtersState && filtersState.months.length > 0) {
        this.selectedMonths = this.months.filter(month =>
          filtersState.months.includes(`${this.currentYear}-${month.value}-01`)
        );
        this.selectedStartMonth = this.selectedMonths[0];
        this.selectedEndMonth = this.selectedMonths[this.selectedMonths.length - 1];
      } else {
        this.setDefaultMonths();
      }
    });

    this.getInfoUser();
  }

  setDefaultMonths() {
    this.selectedStartMonth = this.months[5];
    this.selectedEndMonth = this.months[6];
    // this.updateSelectedMonths();
  }

  selectStartMonth(month: any, menuTrigger: MatMenuTrigger): void {
    this.selectedStartMonth = month;
    this.updateSelectedMonths();
    console.log(`Mes de inicio seleccionado: ${month.name} (${month.value})`);
    menuTrigger.closeMenu();
  }

  selectEndMonth(month: any, menuTrigger: MatMenuTrigger): void {
    this.selectedEndMonth = month;
    this.updateSelectedMonths();
    console.log(`Mes de fin seleccionado: ${month.name} (${month.value})`);
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

        this.selectedMonths = selectedRange;
        console.log(`Rango de meses seleccionado: ${this.selectedMonths.map(m => m.name).join(', ')}`);
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
    }

    if (this.selectedMonths.length) {
      filters.requestType = 'Month';
      filters.months = this.selectedMonths.map(month => `${this.currentYearComplete}-${month.value}-01`);

      filtersSolarCoverage.requestType = 2;
      filtersSolarCoverage.months = this.selectedMonths.map(month => `${this.currentYearComplete}-${month.value}-01`);
      filtersBatu.months = this.selectedMonths.map(month => `${this.currentYearComplete}-${month.value}`);

      this.store.dispatch(setFilters({ filters }));
      this.store.dispatch(setFiltersBatu({ filtersBatu }));
      this.store.dispatch(setFiltersSolarCoverage({ filtersSolarCoverage }));
      console.log('filters', filters);
      console.log('filtersBatu', filtersBatu);
      console.log('filtersSolarCoverage', filtersSolarCoverage);
    }
  }

  signOut() {
    localStorage.removeItem('userEnergiaReal');
    this.router.navigate(['/account/login']);
  }

  getInfoUser() {
    this.accountService.getInfoUser().subscribe((data: User) => {
      this.userInfo = data;
    })
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.unsubscribe();
  }
}
