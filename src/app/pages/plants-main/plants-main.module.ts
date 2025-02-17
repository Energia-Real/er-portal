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
import { PlantsComponent } from './plants/plants.component';
import { NewPlantComponent } from './plants/new-plant/new-plant.component';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

import { CarouselModule } from 'ngx-owl-carousel-o';
import { SavingsComponent } from './plant-details/savings/savings.component';
import { SiteDetailsComponent } from './plant-details/site-details/site-details.component';
import { SitePerformanceComponent } from './plant-details/site-performance/site-performance.component';
import { PlantsDetailComponent } from './plant-details/plant-details.component';
import { ModalExportDataComponent } from './plant-details/site-performance/modal-export-data/modal-export-data.component';
import { NewEquipmentComponent } from './plant-details/savings/components/new-equipment/new-equipment.component';
import { InverterDetailComponent } from './plant-details/inverter-detail/inverter-detail.component';
import { ObservedParametersComponent } from './plant-details/observed-parameters/observed-parameters.component';
import { LiveKpiComponent } from './plant-details/live-kpi/live-kpi.component';
import { ComulativeKpiComponent } from './plant-details/comulative-kpi/comulative-kpi.component';
import { InfoProvidersDevicesComponent } from './plant-details/info-providers-devices/info-providers-devices.component';
import { PlantAssetsCo2Component } from './plant-details/plant-assets-co2/plant-assets-co2.component';
import { InverterComponent } from './plant-details/inverter/inverter.component';
import { TransformerComponent } from './plant-details/transformer/transformer.component';
import { WeatherStationComponent } from './plant-details/weather-station/weather-station.component';
import { HtPanelComponent } from './plant-details/ht-panel/ht-panel.component';
import { PlantsEvenetSummaryComponent } from './plant-details/plants-evenet-summary/plants-evenet-summary.component';

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
    InverterDetailComponent,
    ObservedParametersComponent,
    LiveKpiComponent,
    ComulativeKpiComponent,
    InfoProvidersDevicesComponent,
    PlantAssetsCo2Component,
    InverterComponent,
    TransformerComponent,
    WeatherStationComponent,
    HtPanelComponent,
    PlantsEvenetSummaryComponent,
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
    NgxImageZoomModule,
    NgxSkeletonLoaderModule,
    CarouselModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports : [
    LiveKpiComponent,
    ComulativeKpiComponent,
    ObservedParametersComponent
  ]
})

export class PlantsMainModule { }
