
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BillingComponent } from './billing/billing.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedComponensModule } from '@app/shared/components/shared-components.module';
import { ReturnBarModule } from '@app/shared/components/return-bar/return-bar.module';
import { MaterialModule } from '@app/shared/material/material.module';
import { InfoCardComponent } from '@app/shared/components/info-card/info-card.component';
import { MessageNoDataComponent } from '@app/shared/components/message-no-data/message-no-data.component';
import { BillingRoutingModule } from './billing-routing.module';
import { NumberFormatInputPipe } from '@app/shared/pipes/numberFormatInput.pipe';
import { PreviousBillingComponent } from './previous-billing/previous-billing.component';
import { BillingOverviewComponent } from './billing-overview/billing-overview.component';
import { DetailsOverviewComponent } from './previous-billing-v2/details-overview/details-overview.component';
import { PreviousBillingV2Component } from './previous-billing-v2/previous-billing-v2.component';
import { CurrentBillingComponent } from './billing-overview/current-billing/current-billing.component';
import { BillingDetailsComponent } from './billing-overview/billing-details/billing-details.component';
import { OverviewComponent } from './billing-overview/billing-details/overview/overview.component';
import { BillingHistoryComponent } from './billing-overview/billing-details/billing-history/billing-history.component';
import { SitesComponent } from './billing-overview/billing-details/sites/sites.component';
import { BillingInformationComponent } from './billing-overview/billing-details/billing-information/billing-information.component';
import { NgChartsModule } from 'ng2-charts';
import { ModalInvoiceDetailsComponent } from './billing-overview/current-billing/modal-invoice-details/modal-invoice-details.component';


@NgModule({
  declarations: [
    BillingComponent,
    NumberFormatInputPipe,
    PreviousBillingComponent,
    BillingOverviewComponent,
    DetailsOverviewComponent,
    PreviousBillingV2Component,
    CurrentBillingComponent,
    BillingDetailsComponent,
    OverviewComponent,
    BillingHistoryComponent,
    SitesComponent,
    BillingInformationComponent,
    ModalInvoiceDetailsComponent
  ],
  imports: [
    CommonModule,
    BillingRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedComponensModule,
    ReturnBarModule,
    MaterialModule,
    InfoCardComponent,
    MessageNoDataComponent,
    NgChartsModule
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class BillingMainModule { }
