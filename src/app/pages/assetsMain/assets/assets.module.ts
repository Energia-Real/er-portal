import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AssetsRoutingModule } from './assets-routing.module';
import { ManagementComponent } from './management/management.component';
import { LayoutComponent } from './layout/layout.component';
import { DetailsContainerComponent } from './details-container/details-container.component';
import { LayoutModule } from '@app/shared/components/layout/layout.module';
import { ReturnBarModule } from '@app/shared/components/return-bar/return-bar.module';
import { MaterialModule } from '@app/shared/material/material.module';
import { OverviewDetailsComponent } from './overview-details/overview-details.component';
import { SiteDetailsComponent } from './site-details/site-details.component';
import { SitePerformanceComponent } from './site-performance/site-performance.component';
import { NewPlantComponent } from './new-plant/new-plant.component';

@NgModule({
  declarations: [
    ManagementComponent,
    LayoutComponent,
    DetailsContainerComponent,
    OverviewDetailsComponent,
    SiteDetailsComponent,
    SitePerformanceComponent,
    NewPlantComponent,
  ],
  imports: [
    CommonModule,
    AssetsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LayoutModule,
    ReturnBarModule,
    MaterialModule
  ]
})
export class AssetsModule { }
