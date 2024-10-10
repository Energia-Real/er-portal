import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@app/auth/auth.service';
import { Subject, takeUntil } from 'rxjs';
import packageJson from '../../../../../package.json';
import { setGeneralFilters, setFiltersBatu, setFiltersSolarCoverage } from '@app/core/store/actions/filters.actions';
import { Store } from '@ngrx/store';
import { FilterState, UserV2 } from '@app/shared/models/general-models';
import { selectFilters } from '@app/core/store/selectors/filters.selector';
import { MatMenuTrigger } from '@angular/material/menu';
import { FormControl } from '@angular/forms';

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
  selectedEndMonth = this.months[6];

  currentYear = new Date().getFullYear().toString().slice(-2);
  currentYearComplete = new Date().getFullYear();
  selectedMonths: { name: string; value: string }[] = [];

  singleMonth = new FormControl('')

  selectedStates: string[] = [];

  constructor(
    private accountService: AuthService,
    private router: Router,
    private store: Store<{ filters: FilterState }>
  ) { }

  ngOnInit(): void {
    this.loadUserInfo();
  }
  
  ngAfterViewInit(): void {
    this.singleMonth.valueChanges.pipe(takeUntil(this.onDestroy$)).subscribe(content => {
      if (content) this.selectedEndMonth.value = ''
      this.searchWithFilters()
    })
    this.subscribeToFilters();
  }

  loadUserInfo() {
    this.accountService.getInfoUser().subscribe((data: UserV2) => this.userInfo = data);
  }

  subscribeToFilters() {
    this.store.select(selectFilters).pipe(takeUntil(this.onDestroy$)).subscribe((filtersState) => {
      console.log('subscribeToFilters', filtersState);
      this.setDefaultMonths();
    });
  }

  setDefaultMonths() {
    this.selectedStartMonth = this.months[5];
    this.selectedEndMonth = this.months[6];
    this.searchWithFilters()
  }

  selectStartMonth(month: { name: string; value: string }, menuTrigger: MatMenuTrigger): void {
    this.selectedStartMonth = month;
    this.searchWithFilters()
    menuTrigger.closeMenu();
  }

  selectEndMonth(month: { name: string; value: string }, menuTrigger: MatMenuTrigger): void {
    this.selectedEndMonth = month;
    this.searchWithFilters()
    menuTrigger.closeMenu();
  }

  searchWithFilters() {
    const generalFilters = {
      startDate: `${this.currentYearComplete}-${this.selectedStartMonth.value}-01`,
      endDate: this.singleMonth.value ? null : `${this.currentYearComplete}-${this.selectedEndMonth.value}-01`
    }

    console.log('GENERAL', generalFilters);
    this.store.dispatch(setGeneralFilters({ generalFilters }));
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
