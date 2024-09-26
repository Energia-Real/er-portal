import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SharedComponensModule } from '@app/shared/components/header/shared-components.module';
import { MaterialModule } from '@app/shared/material/material.module';


@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [CommonModule, SharedComponensModule, MaterialModule],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss'
})
export class OverviewComponent {
 
  constructor(private route: ActivatedRoute){}

  ngOnInit(): void {
  }
}
