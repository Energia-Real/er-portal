import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute } from '@angular/router';
import { LayoutModule } from '@app/_shared/components/layout/layout.module';

const materialModules = [
  MatProgressSpinnerModule
];

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [CommonModule, LayoutModule, ...materialModules],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss'
})
export class OverviewComponent {
 
  constructor(private route: ActivatedRoute){}

  ngOnInit(): void {
  }
}
