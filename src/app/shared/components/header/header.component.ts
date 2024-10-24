import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@app/auth/auth.service';
import { distinctUntilChanged, Subject, take, takeUntil } from 'rxjs';
import packageJson from '../../../../../package.json';
import { setGeneralFilters, setFiltersBatu, setFiltersSolarCoverage, setFilters } from '@app/core/store/actions/filters.actions';
import { Store } from '@ngrx/store';
import { FilterState, UserV2 } from '@app/shared/models/general-models';
import { selectFilters } from '@app/core/store/selectors/filters.selector';
import { MatMenuTrigger } from '@angular/material/menu';
import { FormControl } from '@angular/forms';

declare var gtag: Function;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, AfterViewInit, OnDestroy {
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
  selectedEndMonth: any = this.months[6];

  currentYear = new Date().getFullYear().toString().slice(-2);
  currentYearComplete = new Date().getFullYear();
  selectedMonths: { name: string; value: string }[] = [];

  singleMonth = new FormControl(false);

  selectedStates: string[] = [];

  constructor(
    private accountService: AuthService,
    private router: Router,
    private store: Store<{ filters: FilterState }>
  ) { }

  ngOnInit(): void {
    this.loadUserInfo();
    this.subscribeToFilters();
  }

  ngAfterViewInit(): void {
    this.singleMonth.valueChanges.pipe(takeUntil(this.onDestroy$)).subscribe((isSingleMonthSelected) => {
      if (isSingleMonthSelected) {
        this.selectedEndMonth = null;
        this.selectedMonths.pop()
        this.searchWithFilters();
      }
    });
  }

  loadUserInfo() {
    this.accountService.getInfoUser().subscribe((data: UserV2) => this.userInfo = data);
  }

  subscribeToFilters() {
    this.store.select(selectFilters).pipe(
      distinctUntilChanged((prev, curr) => JSON.stringify(prev?.months) == JSON.stringify(curr?.months)),
      takeUntil(this.onDestroy$)
    ).subscribe((filtersState) => {
      if (filtersState && filtersState?.months?.length) {
        const formattedMonths = this.formatSelectedMonths();

        if (JSON.stringify(filtersState.months) !== JSON.stringify(formattedMonths)) {
          this.selectedMonths = this.months.filter(month => filtersState?.months.includes(`${this.currentYearComplete}-${month.value}-01`));
          this.updateStartAndEndMonth();
        }
      } else this.setDefaultMonths();
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
    if (!this.singleMonth.value) {
      this.selectedEndMonth = month;
      this.updateSelectedMonths();
      menuTrigger.closeMenu();
    }
  }

  updateStartAndEndMonth() {
    if (this.selectedMonths.length) {
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
      const generalFilters = {
        startDate: `${this.currentYearComplete}-${this.selectedStartMonth.value}-01`,
        endDate: this.singleMonth.value ? null : `${this.currentYearComplete}-${this.selectedEndMonth.value}-01`
      };

      const filters = { requestType: 'Month', months: formattedMonths };
      const filtersBatu = { months: this.selectedMonths.map(month => `${this.currentYearComplete}-${month.value}`) };
      const filtersSolarCoverage = {
        brand: "huawei",
        clientName: "Merco",
        requestType: 2,
        months: formattedMonths
      };

      this.store.select(selectFilters).pipe(take(1)).subscribe((currentFiltersState: any) => {
        if (JSON.stringify(currentFiltersState?.generalFilters) != JSON.stringify(generalFilters)) this.store.dispatch(setGeneralFilters({ generalFilters }));
        if (JSON.stringify(currentFiltersState?.filters) != JSON.stringify(filters)) this.store.dispatch(setFilters({ filters }));
        if (JSON.stringify(currentFiltersState?.filtersBatu) != JSON.stringify(filtersBatu)) this.store.dispatch(setFiltersBatu({ filtersBatu }));
        if (JSON.stringify(currentFiltersState?.filtersSolarCoverage) != JSON.stringify(filtersSolarCoverage)) this.store.dispatch(setFiltersSolarCoverage({ filtersSolarCoverage }));
      });
    }
  }

  signOut() {
    localStorage.removeItem('userEnergiaReal');
    this.router.navigate(['']);
  }


  /** Google Analytics
 * Registra un evento de clic en el menú.
 * @param menuItem - El nombre del ítem del menú que se ha clicado.
 * Captura la ruta actual, el nivel de acceso del usuario y la marca de tiempo del clic.
 */
  trackMenuClick(menuItem: string) {
    const currentRoute = this.router.url;
    const userAccess = this.userInfo?.accessTo;

    gtag('event', 'menu_click', {
      'debug_mode': true,
      'event_category': 'navigation',
      'event_label': menuItem,
      'current_route': currentRoute,
      'user_access': userAccess,
      'timestamp': new Date().toISOString()
    });
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
