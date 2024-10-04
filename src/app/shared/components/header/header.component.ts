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

  selectedMonth: { name: string; value: string } | null = null; // Mes seleccionado con nombre y valor
  @Output() monthSelected = new EventEmitter<{ month: string, year: any }>();
  @ViewChild(MatMenuTrigger) menuTrigger!: MatMenuTrigger; // Referencia al menú disparador
  isOpen = false; 

  selectedMonths:any[] = []

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

  selectStartMonth(month: any, menuTrigger: MatMenuTrigger): void {
    this.selectedStartMonth = month;
    console.log(`Mes de inicio seleccionado: ${month.name} (${month.value})`); 
    menuTrigger.closeMenu(); 
  }

  selectEndMonth(month: any, menuTrigger: MatMenuTrigger): void {
    this.selectedEndMonth = month;
    console.log(`Mes de fin seleccionado: ${month.name} (${month.value})`);
    menuTrigger.closeMenu(); 
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
