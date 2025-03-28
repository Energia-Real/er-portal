import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FinantialModelRoutingModule } from './finantial-model-routing.module';
import { FinantialModelLayoutComponent } from './finantial-model-layout/finantial-model-layout.component';
import { FinantialStepperComponent } from './finantial-stepper/finantial-stepper.component';
import { MaterialModule } from '@app/shared/material/material.module';


@NgModule({
  declarations: [
    FinantialModelLayoutComponent,
    FinantialStepperComponent
  ],
  imports: [
    CommonModule,
    FinantialModelRoutingModule,
    MaterialModule
  ]
})
export class FinantialModelModule { }
