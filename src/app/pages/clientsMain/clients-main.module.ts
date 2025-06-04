import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { SharedComponensModule } from '@app/shared/components/shared-components.module';
import { ReturnBarModule } from '@app/shared/components/return-bar/return-bar.module';
import { MaterialModule } from '@app/shared/material/material.module';
import { HighchartsChartModule } from 'highcharts-angular';
import { ChartModule } from 'angular-highcharts';
import { NgApexchartsModule } from 'ng-apexcharts';
import { NgChartsModule } from 'ng2-charts';
import { MessageNoDataComponent } from '@app/shared/components/message-no-data/message-no-data.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { NgxImageZoomModule } from 'ngx-image-zoom';
import { InfoCardComponent } from '@app/shared/components/info-card/info-card.component';
import { ClientsRoutingModule } from './clients-routing.module';
import { ClientsComponent } from './clients/clients.component';
import { TypesClientsComponent } from './types-clients/types-clients.component';
import { NewClientComponent } from './new-client/new-client.component';
import { CorporateNamesComponent } from './corporate-names/corporate-names.component';
import { EditCorporateNameComponent } from './edit-corporate-name/edit-corporate-name.component';


@NgModule({
  declarations: [
    ClientsComponent,
    TypesClientsComponent,
    NewClientComponent,
    CorporateNamesComponent,
    EditCorporateNameComponent,
  ],
  imports: [
    CommonModule,
    ClientsRoutingModule,
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
    TranslateModule
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ClientsMainModule { }
