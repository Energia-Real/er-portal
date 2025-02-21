import { Component, Input } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-live-kpi',
  templateUrl: './live-kpi.component.html',
  styleUrl: './live-kpi.component.scss'
})
export class LiveKpiComponent {
  private onDestroy$ = new Subject<void>();
  @Input() data!: any;
  @Input() notData!: boolean;

  dataDummy:any = [
    {
      icon : '../../../../../assets/icons/power.loading.svg',
      title: 'Power Loading (%)',
      description: 'N/A',
    },
    {
      icon : '../../../../../assets/icons/hearsink.svg',
      title: 'Hearsink Temperature Avarage (Degree Celsius)',
      description: 'N/A',
    },
    {
      icon : '../../../../../assets/icons/specific.power.svg',
      title: 'Specific power (kW/kWp)',
      description: 'N/A',
    },
    {
      icon : '../../../../../assets/icons/efficiency.svg',
      title: 'Eficiency (%)',
      description: 'N/A',
    },
    {
      icon : '../../../../../assets/icons/thermal.loading.svg',
      title: 'Thermal loading (%)',
      description: 'N/A',
    }
  ]
}
