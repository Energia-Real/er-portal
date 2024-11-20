import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutRoutingModule } from './layout-routing.module';
import { LayoutComponent } from './layout/layout.component';
import { SharedComponensModule } from "../shared/components/shared-components.module";
import { MessageNoDataComponent } from '@app/shared/components/message-no-data/message-no-data.component';

@NgModule({
  declarations: [
    LayoutComponent
  ],
  imports: [
    CommonModule,
    LayoutRoutingModule,
    SharedComponensModule,
    MessageNoDataComponent
  ]
})
export class LayoutModule { }
