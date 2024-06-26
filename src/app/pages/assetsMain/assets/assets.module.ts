import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AssetsRoutingModule } from './assets-routing.module';
import { ManagementComponent } from './management/management.component';
import { LayoutComponent } from './layout/layout.component';
import { DetailsContainerComponent } from './details-container/details-container.component';
import { LayoutModule } from '@app/shared/components/layout/layout.module';
import { ReturnBarModule } from '@app/shared/components/return-bar/return-bar.module';
import { MaterialModule } from '@app/shared/material/material.module';
import { SiteDetailsComponent } from './site-details/site-details.component';
import { SitePerformanceComponent } from './site-performance/site-performance.component';
import { NewPlantComponent } from './new-plant/new-plant.component';
import {InfoCardComponent} from '../../../shared/components/info-card/info-card.component'
import { HighchartsChartModule } from 'highcharts-angular';
import { ChartModule } from 'angular-highcharts';
import { NgApexchartsModule } from 'ng-apexcharts';
import { NgChartsModule } from 'ng2-charts';
import { MessageNoDataComponent } from '@app/shared/components/message-no-data/message-no-data.component';
import { InstalationDetailsComponent } from './instalation-details/instalation-details.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { NgxImageZoomModule } from 'ngx-image-zoom';


@NgModule({
  declarations: [
    ManagementComponent,
    LayoutComponent,
    DetailsContainerComponent,
    SiteDetailsComponent,
    SitePerformanceComponent,
    NewPlantComponent,
    InstalationDetailsComponent,
  ],
  imports: [
    CommonModule,
    AssetsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LayoutModule,
    ReturnBarModule,
    MaterialModule,
    InfoCardComponent,
    HighchartsChartModule,
    ChartModule,
    NgApexchartsModule,
    NgChartsModule,
    MessageNoDataComponent,
    PdfViewerModule,
    NgxImageZoomModule
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]

})
export class AssetsModule { }
