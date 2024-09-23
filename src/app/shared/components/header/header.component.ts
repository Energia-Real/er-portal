import { Component, Input, OnDestroy } from '@angular/core';

import { Router } from '@angular/router';
import { AuthService } from '@app/auth/auth.service';
import { Subject, takeUntil } from 'rxjs';
import packageJson from '../../../../../package.json';
import { FormBuilder } from '@angular/forms';
import { setFilters, setFiltersBatu, setFiltersSolarCoverage } from '@app/core/store/actions/filters.actions';
import { Store } from '@ngrx/store';
import { FilterState } from '@app/shared/models/general-models';
import { selectFilters } from '@app/core/store/selectors/filters.selector';

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

  months: { value: string, viewValue: string }[] = [
    { value: '01', viewValue: 'January' },
    { value: '02', viewValue: 'February' },
    { value: '03', viewValue: 'March' },
    { value: '04', viewValue: 'April' },
    { value: '05', viewValue: 'May' },
    { value: '06', viewValue: 'June' },
    { value: '07', viewValue: 'July' },
    { value: '08', viewValue: 'August' },
    { value: '09', viewValue: 'September' },
    { value: '10', viewValue: 'October' },
    { value: '11', viewValue: 'November' },
    { value: '12', viewValue: 'December' }
  ];

  selectedMonths: any[] = [];

  currentYear = new Date().getFullYear();

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
      } else {
        this.setMonths();
      }
    });

    this.getInfoUser();
  }

  setMonths() {
    this.selectedMonths = [this.months[5], this.months[6]];
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
      filters.requestType = 'Month'
      filters.months = this.selectedMonths.map(month => `${this.currentYear}-${month.value}-01`);

      filtersSolarCoverage.requestType = 2
      filtersSolarCoverage.months = this.selectedMonths.map(month => this.currentYear + '-' + month.value + '-01');
      filtersBatu.months = this.selectedMonths.map(month => this.currentYear + '-' + month.value);
      
      this.store.dispatch(setFilters({ filters }));
      this.store.dispatch(setFiltersBatu({ filtersBatu }));
      this.store.dispatch(setFiltersSolarCoverage({ filtersSolarCoverage }));
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
