import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RatesComponent } from './rates/rates.component';
import { RatesRoutingModule } from './rates-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedComponensModule } from '@app/shared/components/shared-components.module';
import { ReturnBarModule } from '@app/shared/components/return-bar/return-bar.module';
import { MaterialModule } from '@app/shared/material/material.module';
import { InfoCardComponent } from '@app/shared/components/info-card/info-card.component';
import { MessageNoDataComponent } from '@app/shared/components/message-no-data/message-no-data.component';


@NgModule({
  declarations: [
    RatesComponent
  ],
  imports: [
    CommonModule,
    RatesRoutingModule,
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
export class RatesMainModule { }
