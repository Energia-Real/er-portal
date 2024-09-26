import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AssetsRoutingModule } from './assets-routing.module';
import { ManagementComponent } from './management/management.component';
import { DetailsContainerComponent } from './details-container/details-container.component';
import { SharedComponensModule } from '@app/shared/components/header/shared-components.module';
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
import { ModalExportDataComponent } from './site-performance/modal-export-data/modal-export-data.component';
import { NewEquipmentComponent } from './instalation-details/components/new-equipment/new-equipment.component';


@NgModule({
  declarations: [
    ManagementComponent,
    DetailsContainerComponent,
    SiteDetailsComponent,
    SitePerformanceComponent,
    NewPlantComponent,
    InstalationDetailsComponent,
    ModalExportDataComponent,
    NewEquipmentComponent,
  ],
  imports: [
    CommonModule,
    AssetsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedComponensModule,
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
export class PlantsModule { }
