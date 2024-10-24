import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutRoutingModule } from './layout-routing.module';
import { LayoutComponent } from './layout/layout.component';
import { SharedComponensModule } from "../shared/components/shared-components.module";


@NgModule({
  declarations: [
    LayoutComponent
  ],
  imports: [
    CommonModule,
    LayoutRoutingModule,
    SharedComponensModule
]
})
export class LayoutModule { }
