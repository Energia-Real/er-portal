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
      icon : '../../../../../assets/icons/dcpower - active.svg',
      title: 'Energy export (MWh)',
      description: 'N/A',
    },
    {
      icon : '../../../../../assets/icons/hearsink - irradiation.svg',
      title: 'Availability daily (%)',
      description: 'N/A',
    },
    {
      icon : '../../../../../assets/icons/hearsink - irradiation.svg',
      title: 'Inverter availability (Energy based) (%)',
      description: 'N/A',
    },
    {
      icon : '../../../../../assets/icons/rms.svg',
      title: 'Specific yield (kWh/kWp)',
      description: 'N/A',
    },
    {
      icon : '../../../../../assets/icons/dcpower - active.svg',
      title: 'Inverter breakdown loss (Energy based) (kWh)',
      description: 'N/A',
    }
  ]
}
