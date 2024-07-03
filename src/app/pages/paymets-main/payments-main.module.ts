import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectPayComponent } from './select-pay/select-pay.component';
import { AssetsRoutingModule } from './payments-routing.module';
import { LayoutComponent } from './layout/layout.component';
import { LayoutModule } from '@app/shared/components/layout/layout.module';
import { MaterialModule } from '@app/shared/material/material.module';
import { MessageNoDataComponent } from '@app/shared/components/message-no-data/message-no-data.component';



@NgModule({
  declarations: [
    SelectPayComponent,
    LayoutComponent
  ],
  imports: [
    CommonModule,
    AssetsRoutingModule,
    LayoutModule,
    MaterialModule,
    MessageNoDataComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]

})
export class PaymetsMainModule { }
