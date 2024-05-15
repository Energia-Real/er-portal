import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-info-card',
  templateUrl: './info-card.component.html',
  styleUrl: './info-card.component.scss',
  standalone:true
})
export class InfoCardComponent {
  @Input() info:any;

}
