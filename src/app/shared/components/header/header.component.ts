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
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnDestroy {
  private onDestroy$ = new Subject<void>();

  userInfo!: UserV2;
  @Input() routeActive = '';
  @Output() monthSelected = new EventEmitter<{ month: string; year: number }>();
  @ViewChild(MatMenuTrigger) menuTrigger!: MatMenuTrigger;

  version = packageJson.version;

  months = [
    { name: 'Jan', value: '01' }, { name: 'Feb', value: '02' }, { name: 'Mar', value: '03' },
    { name: 'Apr', value: '04' }, { name: 'May', value: '05' }, { name: 'Jun', value: '06' },
    { name: 'Jul', value: '07' }, { name: 'Aug', value: '08' }, { name: 'Sep', value: '09' },
    { name: 'Oct', value: '10' }, { name: 'Nov', value: '11' }, { name: 'Dec', value: '12' }
  ];

  selectedStartMonth = this.months[5];
  selectedEndMonth = this.months[6];

  currentYear = new Date().getFullYear().toString().slice(-2);
  currentYearComplete = new Date().getFullYear();
  selectedMonths: { name: string; value: string }[] = [];

  constructor(
    private accountService: AuthService,
    private router: Router,
    private store: Store<{ filters: FilterState }>
  ) { }

  ngOnInit(): void {
    this.loadUserInfo();
    this.subscribeToFilters();
  }

  loadUserInfo() {
    this.accountService.getInfoUser().subscribe((data: UserV2) => this.userInfo = data);
  }

  subscribeToFilters() {
    this.store.select(selectFilters).pipe(takeUntil(this.onDestroy$)).subscribe((filtersState) => {
      if (filtersState && filtersState.months.length > 0) {
        const formattedMonths = this.formatSelectedMonths();
        if (JSON.stringify(filtersState.months) !== JSON.stringify(formattedMonths)) {
          this.selectedMonths = this.months.filter(month =>
            filtersState.months.includes(`${this.currentYearComplete}-${month.value}-01`)
          );
          this.updateStartAndEndMonth();
        }
      } else {
        this.setDefaultMonths();
      }
    });
  }

  setDefaultMonths() {
    this.selectedStartMonth = this.months[5];
    this.selectedEndMonth = this.months[6];
    this.updateSelectedMonths();
  }

  selectStartMonth(month: { name: string; value: string }, menuTrigger: MatMenuTrigger): void {
    this.selectedStartMonth = month;
    this.updateSelectedMonths();
    menuTrigger.closeMenu();
  }

  selectEndMonth(month: { name: string; value: string }, menuTrigger: MatMenuTrigger): void {
    this.selectedEndMonth = month;
    this.updateSelectedMonths();
    menuTrigger.closeMenu();
  }

  updateStartAndEndMonth() {
    if (this.selectedMonths.length > 0) {
      this.selectedStartMonth = this.selectedMonths[0];
      this.selectedEndMonth = this.selectedMonths[this.selectedMonths.length - 1];
    }
  }

  updateSelectedMonths() {
    if (this.selectedStartMonth && this.selectedEndMonth) {
      const startIndex = this.months.findIndex(m => m.value === this.selectedStartMonth.value);
      const endIndex = this.months.findIndex(m => m.value === this.selectedEndMonth.value);
      this.selectedMonths = this.months.slice(
        Math.min(startIndex, endIndex),
        Math.max(startIndex, endIndex) + 1
      );
    }
    this.searchWithFilters();
  }

  formatSelectedMonths(): string[] {
    return this.selectedMonths.map(month => `${this.currentYearComplete}-${month.value}-01`);
  }

  searchWithFilters() {
    if (this.selectedMonths.length > 0) {
      const formattedMonths = this.formatSelectedMonths();

      const filters = { requestType: 'Month', months: formattedMonths };
      const filtersBatu = { months: this.selectedMonths.map(month => `${this.currentYearComplete}-${month.value}`) };
      const filtersSolarCoverage = {
        brand: "huawei",
        clientName: "Merco",
        requestType: 2,
        months: formattedMonths
      };

      this.store.dispatch(setFilters({ filters }));
      this.store.dispatch(setFiltersBatu({ filtersBatu }));
      this.store.dispatch(setFiltersSolarCoverage({ filtersSolarCoverage }));
    }
  }

  signOut() {
    localStorage.removeItem('userEnergiaReal');
    this.router.navigate(['/account/login']);
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
