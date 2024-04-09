import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LayoutModule } from '@app/shared/components/layout/layout.module';
import { MaterialModule } from '@app/shared/material/material.module';


@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [CommonModule, LayoutModule, MaterialModule],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss'
})
export class OverviewComponent {
 
  constructor(private route: ActivatedRoute){}

  ngOnInit(): void {
  }
}
