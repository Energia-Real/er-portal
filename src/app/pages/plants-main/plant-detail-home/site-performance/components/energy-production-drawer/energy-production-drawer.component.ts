import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { updateDrawerSitePerformance } from '@app/core/store/actions/drawerSitePerformance.actions';
import { PlantsService } from '@app/pages/plants-main/plants.service';
import { Store } from '@ngrx/store';
import { error } from 'highcharts';

export interface MonthRequestForm {
  inverterPower: FormControl<number | null>;
  selectedYear: FormControl<number | null>;
  selectedMonth: FormControl<string | null>;
}

@Component({
  selector: 'app-energy-production-drawer',
  templateUrl: './energy-production-drawer.component.html',
  styleUrls: ['./energy-production-drawer.component.scss']
})
export class EnergyProductionDrawerComponent implements OnInit {

  @Input() isOpen = false;

  @Input() plantCode?: string;

  years: number[] = [];
  months: string[] = [
    'January', 'February', 'March', 'April', 'May', 'June', 
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  loading: boolean = false;

  formData: FormGroup<MonthRequestForm> = this.fb.group<MonthRequestForm>({
    inverterPower: this.fb.control<number | null>(null, Validators.required),
    selectedYear: this.fb.control<number | null>(null, Validators.required),
    selectedMonth: this.fb.control<string | null>(null, Validators.required),
  });

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private plantsService: PlantsService,

  ) {
    this.store.dispatch(updateDrawerSitePerformance({
      drawerOpenSP: false, 
      drawerActionSP: "Create", 
      drawerInfoSP: null,
      needReloadSP: true
    }));
  }

  ngOnInit(): void {
    this.formData.reset({
      inverterPower: null,
      selectedMonth: null,
      selectedYear: null,
      
    });
    const currentYear = new Date().getFullYear();
    this.years = Array.from({ length: 2 }, (_, i) => currentYear - i);
    console.log(this.plantCode)
  }

  closeDrawer() {
    this.isOpen = false;
    this.store.dispatch(updateDrawerSitePerformance({
      drawerOpenSP: false, 
      drawerActionSP: "Create", 
      drawerInfoSP: null, 
      needReloadSP: true
    }));
  }

  actionSave() {
    const selectedYear = this.formData.get('selectedYear')?.value;
    const selectedMonth = this.formData.get('selectedMonth')?.value;

    if (selectedYear && selectedMonth) {
      const date = new Date(selectedYear, this.months.indexOf(selectedMonth), 1);
      console.log(date);

    }

    this.store.dispatch(updateDrawerSitePerformance({
      drawerOpenSP: false, 
      drawerActionSP: "Create", 
      drawerInfoSP: null, 
      needReloadSP: true
    }));

    this.closeDrawer();
  }
}
