import { Component, Input } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-comulative-kpi',
  templateUrl: './comulative-kpi.component.html',
  styleUrl: './comulative-kpi.component.scss'
})
export class ComulativeKpiComponent {
private onDestroy$ = new Subject<void>();
  @Input() data!: any;
  @Input() notData!: boolean;

  dataDummy:any = [
    {
      icon : '../../../../../assets/icons/energy.export.svg',
      title: 'Energy export (MWh)',
      description: 'N/A',
    },
    {
      icon : '../../../../../assets/icons/availability.svg',
      title: 'Availability daily (%)',
      description: 'N/A',
    },
    {
      icon : '../../../../../assets/icons/inverter.availability.svg',
      title: 'Inverter availability (Energy based) (%)',
      description: 'N/A',
    },
    {
      icon : '../../../../../assets/icons/specific.yield.svg',
      title: 'Specific yield (kWh/kWp)',
      description: 'N/A',
    },
    {
      icon : '../../../../../assets/icons/inverter.daily.svg',
      title: 'Inverter breakdown loss (Energy based) (kWh)',
      description: 'N/A',
    }
  ]
}
