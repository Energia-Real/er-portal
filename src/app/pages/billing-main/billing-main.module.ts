
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BillingComponent } from './billing/billing.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedComponensModule } from '@app/shared/components/header/shared-components.module';
import { ReturnBarModule } from '@app/shared/components/return-bar/return-bar.module';
import { MaterialModule } from '@app/shared/material/material.module';
import { InfoCardComponent } from '@app/shared/components/info-card/info-card.component';
import { MessageNoDataComponent } from '@app/shared/components/message-no-data/message-no-data.component';
import { BillingRoutingModule } from './billing-routing.module';


@NgModule({
  declarations: [
    BillingComponent
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
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class BillingMainModule { }
