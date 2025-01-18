import { Component, Input } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-observed-parameters',
  templateUrl: './observed-parameters.component.html',
  styleUrl: './observed-parameters.component.scss'
})
export class ObservedParametersComponent {
  private onDestroy$ = new Subject<void>();
  @Input() data!: any;
  @Input() notData!: boolean;

  dataDummy:any = [
    {
      icon : '../../../../../assets/icons/dcpower - active.svg',
      title: 'DC Power (kW)',
      description: 'N/A',
    },
    {
      icon : '../../../../../assets/icons/hearsink - irradiation.svg',
      title: 'Hearsink Temperature Average (Degree Celsius)',
      description: 'N/A',
    },
    {
      icon : '../../../../../assets/icons/hearsink - irradiation.svg',
      title: 'irradiation index (Degree Celsius)',
      description: 'N/A',
    },
    {
      icon : '../../../../../assets/icons/rms.svg',
      title: 'DC RMS voltage (V)',
      description: 'N/A',
    },
    {
      icon : '../../../../../assets/icons/dcpower - active.svg',
      title: 'Active power (kW)',
      description: 'N/A',
    },
    {
      icon : '../../../../../assets/icons/dcCurrent.svg',
      title: 'DC Current (A)',
      description: 'N/A',
    },
    {
      icon : '../../../../../assets/icons/rms.svg',
      title: 'RMS Phase voltage (V)',
      description: 'N/A',
    },
    {
      icon : '../../../../../assets/icons/totalOutput.svg',
      title: 'Total output current (A)',
      description: 'N/A',
    },
  ]
}
