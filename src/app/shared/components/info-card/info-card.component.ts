import { Component, Input } from '@angular/core';
import { MaterialModule } from '@app/shared/material/material.module';

@Component({
  selector: 'app-info-card',
  templateUrl: './info-card.component.html',
  styleUrl: './info-card.component.scss',
  standalone:true, 
  imports:[
    MaterialModule
  ]
})
export class InfoCardComponent {
  @Input() info:any;
  @Input() executeFunction!: Function;  
  @Input() tooltipText!: string;  
  @Input() materialIconName!: string;  
}
