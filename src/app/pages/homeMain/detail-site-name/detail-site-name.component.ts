import { Component, ViewEncapsulation } from '@angular/core';
import { provideNativeDateAdapter } from '@angular/material/core';
import { LayoutModule } from '@app/shared/components/layout/layout.module';
import { MaterialModule } from '@app/shared/material/material.module';

@Component({
  selector: 'app-detail-site-name',
  standalone: true,
  templateUrl: './detail-site-name.component.html',
  styleUrl: './detail-site-name.component.scss',
  imports: [LayoutModule, MaterialModule],
  providers: [provideNativeDateAdapter()],
  encapsulation: ViewEncapsulation.None

})
export class DetailSiteNameComponent {

}
