import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedComponensModule } from '@app/shared/components/shared-components.module';
import { ReturnBarModule } from '@app/shared/components/return-bar/return-bar.module';
import { MaterialModule } from '@app/shared/material/material.module';
import { InfoCardComponent } from '@app/shared/components/info-card/info-card.component';
import { HighchartsChartModule } from 'highcharts-angular';
import { ChartModule } from 'angular-highcharts';
import { NgApexchartsModule } from 'ng-apexcharts';
import { NgChartsModule } from 'ng2-charts';
import { MessageNoDataComponent } from '@app/shared/components/message-no-data/message-no-data.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { NgxImageZoomModule } from 'ngx-image-zoom';
import { PlantsRoutingModule } from './plants-routing.module';
import { SiteDetailsComponent } from './plant-detail-home/site-details/site-details.component';
import { PlantsDetailComponent } from './plant-detail-home/plant-details/plant-details.component';
import { SitePerformanceComponent } from './plant-detail-home/site-performance/site-performance.component';
import { SavingsComponent } from './plant-detail-home/savings/savings.component';
import { ModalExportDataComponent } from './plant-detail-home/site-performance/modal-export-data/modal-export-data.component';
import { PlantsComponent } from './plants/plants.component';
import { NewEquipmentComponent } from './plant-detail-home/savings/components/new-equipment/new-equipment.component';
import { NewPlantComponent } from './plants/new-plant/new-plant.component';
import { InverterDetailComponent } from './plant-detail-home/inverter-detail/inverter-detail.component';

@NgModule({
  declarations: [
    SavingsComponent,
    SiteDetailsComponent,
    SitePerformanceComponent,
    PlantsDetailComponent,
    ModalExportDataComponent,
    NewPlantComponent,
    NewEquipmentComponent,
    PlantsComponent,
    InverterDetailComponent
  ],
  imports: [
    CommonModule,
    PlantsRoutingModule,
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

export class PlantsMainModule { }
