import { Component, EventEmitter, Input, NgZone, OnDestroy, Output, ViewChild } from '@angular/core';

import { Router } from '@angular/router';
import { AuthService } from '@app/auth/auth.service';
import { Subject, take, takeUntil } from 'rxjs';
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

  currentFilters: any = {};
  currentFiltersBatu: any = {};
  currentFiltersSolarCoverage: any = {};

  constructor(
    private accountService: AuthService,
    private router: Router,
    private zone: NgZone,
    private store: Store<{ filters: FilterState }>
  ) { }

  // ngOnInit(): void {
  //   this.store.select(selectFilters).pipe(takeUntil(this.onDestroy$)).subscribe(filtersState => {
  //     console.log('SE TRAJERON', filtersState);

  //     if (filtersState && filtersState?.months?.length) {
  //       this.selectedMonths = this.months.filter(month => {
  //         const filterMonth = `${this.currentYear}-${month.value}-01`;
  //         return filtersState.months.includes(filterMonth);
  //       });

  //       if (this.selectedMonths?.length) {
  //         this.selectedStartMonth = this.selectedMonths[0];
  //         this.selectedEndMonth = this.selectedMonths[this.selectedMonths.length - 1];
  //       } else {
  //         this.setDefaultMonths();
  //       }
  //     } else this.setDefaultMonths();
  //   });


  //   this.getInfoUser();
  // }

  ngOnInit(): void {
    this.store.select(selectFilters).pipe(takeUntil(this.onDestroy$)).subscribe((filtersState: any) => {
      if (filtersState && filtersState.months.length > 0) {
        const formattedSelectedMonths = this.selectedMonths.map(month => `${this.currentYearComplete}-${month.value}-01`);
        const isSameFilters = JSON.stringify(filtersState?.months) === JSON.stringify(formattedSelectedMonths);
  
        if (!isSameFilters) {
          // Solo actualizar si los filtros no son los mismos
          this.updateSelectedMonths();
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
  
      // Despachar directamente sin verificar los filtros en esta función
      this.store.dispatch(setFilters({ filters }));
      this.store.dispatch(setFiltersBatu({ filtersBatu }));
      this.store.dispatch(setFiltersSolarCoverage({ filtersSolarCoverage }));
  
      console.log('Nuevos filtros despachados:', filters);
      console.log('Nuevos filtrosBatu despachados:', filtersBatu);
      console.log('Nuevos filtrosSolarCoverage despachados:', filtersSolarCoverage);
    }
  }

  
  // searchWithFilters() {
  //   let filtersBatu: any = {};
  //   let filters: any = {};
  //   let filtersSolarCoverage: any = {
  //     brand: "huawei",
  //     clientName: "Merco",
  //     months: []
  //   }

  //   if (this.selectedMonths?.length) {
  //     const formattedSelectedMonths = this.selectedMonths.map(month => `${this.currentYearComplete}-${month.value}-01`);
  //     console.log('formattedSelectedMonths', formattedSelectedMonths);
      

  //     filters.requestType = 'Month';
  //     filters.months = this.selectedMonths.map(month => `${this.currentYearComplete}-${month.value}-01`);

  //     filtersSolarCoverage.requestType = 2;
  //     filtersSolarCoverage.months = this.selectedMonths.map(month => `${this.currentYearComplete}-${month.value}-01`);
  //     filtersBatu.months = this.selectedMonths.map(month => `${this.currentYearComplete}-${month.value}`);


  //     this.store.select(selectFilters).pipe(takeUntil(this.onDestroy$)).subscribe((currentFilters: any) => {
  //       console.log('currentFilters', currentFilters);

  //       if (currentFilters && currentFilters?.months?.length) {
  //         const isSameFilters = JSON.stringify(currentFilters?.months) === JSON.stringify(formattedSelectedMonths);
  //         console.log('isSameFilters', isSameFilters);

  //         if (!isSameFilters) {
  //           this.store.dispatch(setFilters({ filters }));
  //           this.store.dispatch(setFiltersBatu({ filtersBatu }));
  //           this.store.dispatch(setFiltersSolarCoverage({ filtersSolarCoverage }));
  //         }
  //       }

  //       else {
  //         this.store.dispatch(setFilters({ filters }));
  //         this.store.dispatch(setFiltersBatu({ filtersBatu }));
  //         this.store.dispatch(setFiltersSolarCoverage({ filtersSolarCoverage }));
  //       }
  //     });

  //     console.log('filters', filters);
  //     console.log('filtersBatu', filtersBatu);
  //     console.log('filtersSolarCoverage', filtersSolarCoverage);
  //   }
  // }

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
