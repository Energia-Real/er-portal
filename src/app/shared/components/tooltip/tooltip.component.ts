import { AfterViewInit, Component, ElementRef, Input } from '@angular/core';
import tippy from 'tippy.js';

export interface InfoItem {
  subtitle: string;
  content: string;
}

@Component({
  selector: 'app-tooltip',
  templateUrl: './tooltip.component.html',
  styleUrl: './tooltip.component.scss'
})
export class TooltipComponent {
  constructor(private elRef: ElementRef) {}
  @Input() title!: string;
  @Input() infoAdicional: InfoItem[] = [];
}