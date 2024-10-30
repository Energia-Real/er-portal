import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectPayComponent } from './select-pay/select-pay.component';
import { AssetsRoutingModule } from './payments-routing.module';
import { LayoutComponent } from './layout/layout.component';
import { SharedComponensModule } from '@app/shared/components/shared-components.module';
import { MaterialModule } from '@app/shared/material/material.module';
import { MessageNoDataComponent } from '@app/shared/components/message-no-data/message-no-data.component';
import { ModalPayComponent } from './modal-pay/modal-pay.component';



@NgModule({
  declarations: [
    SelectPayComponent,
    LayoutComponent,
    ModalPayComponent
  ],
  imports: [
    CommonModule,
    AssetsRoutingModule,
    SharedComponensModule,
    MaterialModule,
    MessageNoDataComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]

})
export class PaymetsMainModule { }
