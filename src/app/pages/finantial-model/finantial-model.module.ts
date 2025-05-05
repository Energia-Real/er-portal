import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FinantialModelRoutingModule } from './finantial-model-routing.module';
import { FinantialModelLayoutComponent } from './finantial-model-layout/finantial-model-layout.component';
import { FinantialStepperComponent } from './finantial-stepper/finantial-stepper.component';
import { MaterialModule } from '@app/shared/material/material.module';
import { MessageNoDataComponent } from "../../shared/components/message-no-data/message-no-data.component";
import { SharedComponensModule } from '@app/shared/components/shared-components.module';

@NgModule({
  declarations: [
    FinantialModelLayoutComponent,
    FinantialStepperComponent
  ],
  imports: [
    CommonModule,
    FinantialModelRoutingModule,
    MaterialModule,
    MessageNoDataComponent,
    SharedComponensModule
]
})
export class FinantialModelModule { }
